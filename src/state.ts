import { observable, computed, action, reaction, ObservableMap } from 'mobx'

import config from 'config'
import tba, { IEventSimple, ITeam, ITeamAward } from 'tba'
import StorablePromise from 'utilities/StorablePromise'

class State {

	private _eventNames: Map<string, string> = new Map()

	@observable private _$loaded: boolean = false

	@observable private _$seconds: number = 0
	@observable private _$minutes: number = 0
	@observable private _$hours: number = 0

	@observable private _$teamInformation: ObservableMap<ITeam | false | null> = observable.map<ITeam | false | null>()
	@observable private _$teamAwards: ObservableMap<ITeamAward[] | false | null> = observable.map<ITeamAward[] | false | null>()

	@computed private get _$teamNumber(): number {
		return this._$hours * 100 + this._$minutes
	}

	public constructor() {
		reaction(() => this._$teamNumber, this._on$TeamNumber)
	}

	public initialize() {
		const eventNamesUpdated: string | null = localStorage.getItem('eventNamesUpdated')

		if (eventNamesUpdated) {
			const timestamp: number = parseInt(eventNamesUpdated)
			// If the timestamp exists, is less than a day old, and is of the same year, use cached data
			if (!isNaN(timestamp) && (Date.now() - timestamp) < 24 * 60 * 60 * 1000 && new Date(timestamp).getFullYear() === new Date().getFullYear()) {
				try {
					this._parseCachedEvents()
				}
				catch (ex) {
					localStorage.removeItem('eventNames')
					this._fetchEvents()
				}
			}
			else {
				this._fetchEvents()
			}
		}
		else {
			this._fetchEvents()
		}
	}

	@action
	private _parseCachedEvents() {
		this._eventNames = new Map(JSON.parse(localStorage.getItem('eventNames') as string))

		this._updateTime()

		this._$loaded = true
	}

	private _fetchEvents() {
		const year: number = new Date().getFullYear()
		const eventsPromises: Promise<IEventSimple[]>[] = []
		for (let i = 0; i < config.eventYearCount; i++) {
			const promise: StorablePromise<IEventSimple[]> = new StorablePromise()
			eventsPromises.push(promise.getPromise())
			setTimeout(this._getEvents.bind(null, year - i, promise), i * 500)
		}

		Promise.all(eventsPromises)
			.then(this._onEvents)
			.catch(this._onEventsError)
	}

	private _getEvents = (year: number, promise: StorablePromise<IEventSimple[]>) => {
		tba.eventsSimple(year)
			.then((events: IEventSimple[]) => {
				promise.resolve(events)
			})
			.catch((reason: any) => {
				promise.reject(reason)
			})
	}

	@action
	private _onEvents = (events: IEventSimple[][]) => {
		for (let yearsEvents of events) {
			for (let event of yearsEvents) {
				this._eventNames.set(event.key, event.name.split('sponsored')[0].trim())
			}
		}

		const storable: string[][] = []
		this._eventNames.forEach((name: string, key: string) => {
			storable.push([key, name])
		})
		localStorage.setItem('eventNamesUpdated', `${Date.now()}`)
		localStorage.setItem('eventNames', JSON.stringify(storable))

		this._updateTime()

		this._$loaded = true
	}

	private _onEventsError = (reason: any) => {

	}

	private _on$TeamNumber = (teamNumber: number) => {
		for (let i = 0; i <= config.teamPrefetchCount; i++) {
			const requestTeamNumber: number = teamNumber + i
			if (!this._$teamInformation.has(`${requestTeamNumber}`)) {
				this._mark$TeamInformationPending(requestTeamNumber)
				setTimeout(() => {
					tba.team(requestTeamNumber)
						.then(this._onTeamInformation.bind(null, requestTeamNumber))
						.catch(this._onTeamInformationError.bind(null, requestTeamNumber))
				}, i * 250)
			}
		}

		this._deleteLastTeam()
	}

	@action
	private _mark$TeamInformationPending = (teamNumber: number) => {
		this._$teamInformation.set(`${teamNumber}`, null)
		this._$teamAwards.set(`${teamNumber}`, null)
	}

	@action
	private _deleteLastTeam = () => {
		this._$teamInformation.delete(`${this._$teamNumber - 1}`)
		this._$teamAwards.delete(`${this._$teamNumber - 1}`)
	}

	@action
	private _onTeamInformation = (teamNumber: number, team: ITeam) => {
		this._$teamInformation.set(`${teamNumber}`, team)

		tba.teamAwards(teamNumber).then(this._onTeamAwards.bind(null, teamNumber))
	}

	@action
	private _onTeamAwards = (teamNumber: number, awards: ITeamAward[]) => {
		this._$teamAwards.set(`${teamNumber}`, awards)
	}

	@action
	private _onTeamInformationError = (teamNumber: number) => {
		this._$teamInformation.set(`${teamNumber}`, false)
		this._$teamAwards.set(`${teamNumber}`, false)
	}

	@action
	private _updateTime = () => {
		// Fix clock to team number if specified as 'team-number' parameter in URL
		if (window.location.search) {
			const teamNumbers: string[] = window.location.search.substring(1)
				.split('&')
				.filter(parameter => parameter.startsWith('team-number='))
			if (teamNumbers.length && teamNumbers[0].split('=').length === 2) {
				const teamNumber: number = parseInt(teamNumbers[0].split('=')[1])
				if (!isNaN(teamNumber) && teamNumber > 0 && teamNumber < 10000) {
					this._$hours = Math.floor(teamNumber / 100)
					this._$minutes = teamNumber % 100
					return
				}
			}
		}

		const now: Date = new Date()
		this._$hours = now.getHours()
		this._$minutes = now.getMinutes()
		this._$seconds = now.getSeconds()

		setTimeout(this._updateTime, 1000 - now.getMilliseconds())
	}

	public get$Loaded(): boolean {
		return this._$loaded
	}

	public get$Seconds(): number {
		return this._$seconds
	}

	public get$Minutes(): number {
		return this._$minutes
	}

	public get$Hours(): number {
		return this._$hours
	}

	public get$TeamNumber(): number {
		return this._$teamNumber
	}

	public getEventName(key: string): string | undefined {
		return this._eventNames.get(key)
	}

	public get$TeamInformation(teamNumber: number): ITeam | false | null | undefined {
		return this._$teamInformation.get(`${teamNumber}`)
	}

	public get$TeamAwards(teamNumber: number): ITeamAward[] | false | null | undefined {
		return this._$teamAwards.get(`${teamNumber}`)
	}

}

export default new State()
