import { observer } from 'mobx-react'
import * as React from 'react'

import state from 'state'
import { ITeam } from 'tba'

import './component.less'

interface IProps extends React.Props<void> { }

const Team: React.StatelessComponent<IProps> = (): JSX.Element => {
	const $teamNumber: number = state.get$TeamNumber()
	const $teamInformation: ITeam | false | null | undefined = state.get$TeamInformation($teamNumber)

	if ($teamInformation) {
		return (
			<div className='team'>
				<span className='name'>{$teamInformation.nickname || $teamInformation.name}</span>
				<span className='information'>
					<span className='item'><a className='tba' href={`https://www.thebluealliance.com/team/${$teamNumber}`} target='_blank' /></span>
					&middot;
					<span className='item'>{$teamInformation.rookie_year}</span>
					&middot;
					<span className='item'>{formatLocation($teamInformation)}</span>
					&middot;
					<span className='item'>{$teamInformation.home_championship ? $teamInformation.home_championship[`${new Date().getFullYear()}`] : 'Inactive'}</span>
					{$teamInformation.website ? <span>&middot;</span> : null}
					{$teamInformation.website ? <span className='item'><a className='website' href={$teamInformation.website} target='_blank' /></span> : null}
				</span>
			</div>
		)
	}
	else {
		return (
			<div className='team'>
				<span className='name'>{$teamInformation === false ? 'No team' : 'Loading...'}</span>
				<span className='empty' />
			</div>
		)
	}
}

function formatLocation(teamInformation: ITeam): string {
	let location: string = `${teamInformation.city}, `
	if (teamInformation.state_prov) {
		location += `${teamInformation.state_prov}, `
	}
	location += teamInformation.country

	return location
}

export default observer(Team)
