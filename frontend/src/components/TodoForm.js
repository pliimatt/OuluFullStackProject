import React from 'react';
import {Form, Button, Checkbox} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {addToList} from '../actions/todoActions';

class TodoForm extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			todo: "",
			hasDeadline: false,
			deadLine: new Date()
		}
	}

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	onSubmit = (event) => {
		event.preventDefault();
		let item = {
			todo: this.state.todo,
			isDone: false,
			deadLine: this.state.hasDeadline ? this.state.deadLine : null
		}
		this.props.dispatch(addToList(this.props.token, item));
		this.setState({
			todo: "",
			hasDeadline: false,
			deadLine: new Date()
		})
	}

	render () {
		return (
			<div style={{
				width: 500,
				margin: "auto",
				backgroundColor: "lightgreen"
			}}>
				<Form onSubmit={this.onSubmit}>
					<Form.Field>
						<label htmlFor={"todo"}>{"Todo"}</label>
						<input type="text"
							name={"todo"}
							onChange={this.onChange}
							value={this.state.todo} />
					</Form.Field>

					<div>
						<Checkbox checked={this.state.hasDeadline}
							onChange={() => this.setState({hasDeadline: !this.state.hasDeadline})}
							label={this.state.hasDeadline ? "disable deadline" : "enable deadline"} />
					</div>

					{this.state.hasDeadline ?
						<Form.Field>
							<input type="Date"
								name={"deadLine"}
								onChange={this.onChange}
								value={this.state.deadLine} />
						</Form.Field> :
						<div></div>}
					<Button type="submit">Add</Button>
				</Form>
			</div>
		)

	}
}

const mapStateToProps = (state) => {
	return {
		token: state.login.token
	}
}

export default connect(mapStateToProps)(TodoForm);