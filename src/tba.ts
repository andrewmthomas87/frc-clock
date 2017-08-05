import axios, { AxiosInstance, AxiosResponse } from 'axios'

import config from 'config'

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

	public team(teamNumber: number): Promise<ITeam> {
		return this._get<ITeam>(`/team/frc${teamNumber}`)
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

export { ITeam, tba as default }
