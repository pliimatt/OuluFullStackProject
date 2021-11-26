import React from 'react';
import {List, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../actions/loginActions';

class Navbar extends React.Component {

	render () {
		let navStyle = {
			height: 80,
			backgroundColor: "lightblue"
		}

		let header = <Header>Todo App</Header>
		if (this.props.loading) {
			header = <Header>Loading ... </Header>
		}
		if (this.props.error) {
			header = <Header>{this.props.error}</Header>
		}

		let list = (
			<List horizontal>
				<List.Item><Link to="/list">Todo List</Link></List.Item>
				<List.Item><Link to="/done">Done todos</Link></List.Item>
				<List.Item><Link to="/form">Add new item</Link></List.Item>
				<List.Item><Link to="/" onClick={() => this.props.dispatch(logout(this.props.token))}>Logout</Link></List.Item>
			</List>)

		return (
			<div style={navStyle}>
				{header}
				{this.props.isLogged ? list : <div></div>}
			</div>
		)

	}
}

const mapStateToProps = (state) => {
	let error = "";
	if (state.todo.error) {
		error = state.todo.error
	}
	if (state.login.error) {
		error = state.login.error
	}
	return {
		isLogged: state.login.isLogged,
		token: state.login.token,
		loading: state.login.loading,
		error: error
	}
}

export default connect(mapStateToProps)(Navbar);
