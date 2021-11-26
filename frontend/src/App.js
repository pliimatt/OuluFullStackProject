import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import DoneTodoList from './components/DoneTodoList';
import {connect} from 'react-redux';

class App extends React.Component {

	render () {
		return (
			<div className="App">
				<Navbar />
				<hr />
				<Switch>
					<Route exact path="/" render={() => this.props.isLogged ?
						(<Redirect to="/list" />) :
						(<LoginPage />)
					} />
					<Route path="/list" render={() => this.props.isLogged ?
						(<TodoList />) :
						(<Redirect to="/" />)
					} />
					<Route path="/done" render={() => this.props.isLogged ?
						(<DoneTodoList />) :
						(<Redirect to="/" />)
					} />
					<Route path="/form" render={() => this.props.isLogged ?
						(<TodoForm />) :
						(<Redirect to="/" />)
					} />
					<Route render={() => this.props.isLogged ?
						(<Redirect to="/list" />) :
						(<Redirect to="/" />)
					} />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLogged: state.login.isLogged,
		token: state.login.token
	}
}

export default connect(mapStateToProps)(App);
