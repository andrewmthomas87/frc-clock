import * as React from 'react'
import { render } from 'react-dom'

import state from 'state'

import App from 'components/App'

import 'less/app.less'

state.initialize()

render(<App />, document.querySelector('div#app'))
