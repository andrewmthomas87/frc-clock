import { observable, computed, action, reaction, ObservableMap } from 'mobx'

import config from 'config'
import tba, { ITeam } from 'tba'

class State {

	@observable private _$seconds: number = 0
	@observable private _$minutes: number = 0
	@observable private _$hours: number = 0

	@observable private _$teamInformation: ObservableMap<ITeam | false | null> = observable.map<ITeam | false | null>()

	@computed private get _$teamNumber(): number {
		return this._$hours * 100 + this._$minutes
	}

	public constructor() {
		reaction(() => this._$teamNumber, this._on$TeamNumber)
	}

	public initialize() {
		this._updateTime()
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

	public get$TeamInformation(teamNumber: number): ITeam | false | null | undefined {
		return this._$teamInformation.get(`${teamNumber}`)
	}

	private _on$TeamNumber = (teamNumber: number) => {
		for (let i = 0; i <= config.teamPrefetchCount; i++) {
			const requestTeamNumber: number = teamNumber + i
			if (!this._$teamInformation.has(`${requestTeamNumber}`)) {
				this._mark$TeamInformationPending(requestTeamNumber)
				setTimeout(() => {
					tba.team(requestTeamNumber)
						.then(this._onTeamInformation)
						.catch(this._onTeamInformationError.bind(null, requestTeamNumber))
				}, i * 250)
			}
		}
	}

	@action
	private _mark$TeamInformationPending = (teamNumber: number) => {
		this._$teamInformation.set(`${teamNumber}`, null)
	}

	@action
	private _onTeamInformation = (team: ITeam) => {
		this._$teamInformation.set(`${team.team_number}`, team)
	}

	@action
	private _onTeamInformationError = (teamNumber: number) => {
		this._$teamInformation.set(`${teamNumber}`, false)
	}

	@action
	private _updateTime = () => {
		const now: Date = new Date()
		this._$hours = now.getHours()
		this._$minutes = now.getMinutes()
		this._$seconds = now.getSeconds()

		setTimeout(this._updateTime, 1000 - now.getMilliseconds())
	}

}

export default new State()
