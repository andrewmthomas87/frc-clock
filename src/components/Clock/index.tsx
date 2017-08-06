import { observer } from 'mobx-react'
import * as React from 'react'

import state from 'state'

import './component.less'

interface IProps extends React.Props<void> { }

const Clock: React.StatelessComponent<IProps> = (): JSX.Element => {
	const $seconds: number = state.get$Seconds()
	const $minutes: number = state.get$Minutes()
	const $hours: number = state.get$Hours()

	const displayHours: string = `${$hours < 10 ? '0' : ''}${$hours}`
	const displayMinutes: string = `${$minutes < 10 ? '0' : ''}${$minutes}`
	const displaySeconds: string = `${$seconds < 10 ? '0' : ''}${$seconds}`

	return (
		<div className='clock'>
			<span className='hours'>{displayHours}</span>
			<span className='divider'></span>
			<span className='minutes'>{displayMinutes}</span>
			<span className='seconds'>{displaySeconds}</span>
			<a className={state.getPaused() ? 'play' : 'pause'} onClick={state.onTogglePlayPause} />
		</div>
	)
}

export default observer(Clock)
