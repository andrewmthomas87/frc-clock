import * as React from 'react'

import Clock from './Clock'
import Team from './Team'

interface IProps extends React.Props<void> { }

const App: React.StatelessComponent<IProps> = (): JSX.Element => (
	<div>
		<Clock />
		<br />
		<Team />
	</div>
)

export default App
