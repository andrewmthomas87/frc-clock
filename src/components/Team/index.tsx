import { observer } from 'mobx-react'
import * as React from 'react'

import state from 'state'
import { ITeam } from 'tba'

import './component.less'

interface IProps extends React.Props<void> { }

const Team: React.StatelessComponent<IProps> = (): JSX.Element => {
	const $teamNumber: number = state.get$TeamNumber()
	const $teamInformation: ITeam | false | null | undefined = state.get$TeamInformation($teamNumber)

	let name: string
	if ($teamInformation === undefined || $teamInformation === null) {
		name = 'Loading'
	}
	else if ($teamInformation === false) {
		name = 'No team'
	}
	else {
		name = $teamInformation.nickname || $teamInformation.name
	}

	return (
		<div className='team'>
			<span className='name'>{name}</span>
			<span className='information'></span>
		</div>
	)
}

export default observer(Team)
