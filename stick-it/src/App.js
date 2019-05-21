import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import Layout from './containers/layout'
const socket = require('socket.io-client')('http://localhost:3001')
class App extends Component {
	render() {
		return (
			// <BrowserRouter basename="/my-app">
			<BrowserRouter>
				<div className="App">
					<Layout socket={socket}/>
				</div>
			</BrowserRouter>
		)
	}
}

export default App
