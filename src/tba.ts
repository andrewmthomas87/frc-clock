import axios, { AxiosInstance, AxiosResponse } from 'axios'

import config from 'config'

interface IEventSimple {
	key: string
	name: string
	event_code: string
	event_type: number
	district: {
		abbreviation: string
		display_name: string
		key: string
		year: number
	}
	city: string
	state_prov: string
	country: string
	start_date: string
	end_date: string
	year: number
}

interface ITeam {
	key: string
	team_number: number
	nickname: string
	name: string
	city: string
	state_prov: string
	country: string
	address: string
	postal_code: string
	gmaps_place_id: string
	gmaps_url: string
	lat: number
	lng: number
	location_name: string
	website: string
	rookie_year: number
	motto: string
	home_championship: { [propName: string]: string }
}

interface ITeamAward {
	name: string
	award_type: number
	event_key: string
	recipient_list: [
		{
			team_key: string
			awardee: string
		}
	]
	year: number
}

class TBA {

	private _axios: AxiosInstance

	public constructor() {
		const headers: any = {}
		headers[config.tba.apiKeyHeaderFieldName] = config.tba.apiKey

		this._axios = axios.create({
			baseURL: config.tba.baseUrl,
			headers
		})
	}

	public eventsSimple(year: number): Promise<IEventSimple[]> {
		return this._get<IEventSimple[]>(`/events/${year}/simple`)
	}

	public team(teamNumber: number): Promise<ITeam> {
		return this._get<ITeam>(`/team/frc${teamNumber}`)
	}

	public teamAwards(teamNumber: number): Promise<ITeamAward[]> {
		return this._get<ITeamAward[]>(`/team/frc${teamNumber}/awards`)
	}

	private _get<T>(endpoint: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this._axios.get(endpoint)
				.then((result: AxiosResponse) => {
					resolve(result.data)
				})
				.catch((reason: any) => {
					reject(reason)
				})
		})
	}

}

const tba: TBA = new TBA()

export { IEventSimple, ITeam, ITeamAward, tba as default }
