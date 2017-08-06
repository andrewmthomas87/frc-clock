import { observer } from 'mobx-react'
import * as React from 'react'

import state from 'state'

import Clock from './Clock'
import Team from './Team'
import Awards from './Awards'

interface IProps extends React.Props<void> { }

const App: React.StatelessComponent<IProps> = (): JSX.Element => {
	const $loaded: boolean = state.get$Loaded()

	if ($loaded) {
		return (
			<div>
				<Clock />
				<Team />
				<Awards />
			</div>
		)
	}
	else {
		return (
			<div><div id='loading'><div /></div></div>
		)
	}
}

export default observer(App)
