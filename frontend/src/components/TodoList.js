import React from 'react';
import TodoListItem from './TodoListItem';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';
import {connect} from 'react-redux';
import {removeFromList, editItem} from '../actions/todoActions';

class TodoList extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			removeIndex: -1,
			editIndex: -1
		}
	}

	changeToRemoveMode = (index) => {
		this.setState({
			removeIndex: index,
			editIndex: -1
		})
	}

	changeToEditMode = (index) => {
		this.setState({
			removeIndex: -1,
			editIndex: index
		})
	}

	cancel = () => {
		this.setState({
			removeIndex: -1,
			editIndex: -1
		})
	}

	removeFromList = (id) => {
		this.props.dispatch(removeFromList(this.props.token, id));
		this.cancel();
	}

	editItem = (item) => {
		this.props.dispatch(editItem(this.props.token, item));
		this.cancel();
	}

	render () {
		let items = this.props.list.filter(item => !item.isDone).map((item, index) => {
			if (this.state.editIndex === index) {
				return (<EditRow key={item._id} item={item}
					editItem={this.editItem}
					cancel={this.cancel} />)
			}
			if (this.state.removeIndex === index) {
				return (<RemoveRow key={item._id} item={item}
					cancel={this.cancel}
					editItem={this.editItem}
					removeFromList={this.removeFromList} />)
			}
			return (
				<TodoListItem key={item._id} item={item}
					index={index}
					editItem={this.editItem}
					changeToRemoveMode={this.changeToRemoveMode}
					changeToEditMode={this.changeToEditMode} />
			)
		})

		return (
			<div className="ui grid">
				<div className="row">
					<div className="two wide column">
						<p>Status</p>
					</div>
					<div className="four wide column">
						<p>Deadline</p>
					</div>
					<div className="six wide column">
						<p>Todo</p>
					</div>
					<div className="four wide column">
						<p>Edit</p>
					</div>
				</div>
				{items}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		token: state.login.token,
		list: state.todo.list
	}
}

export default connect(mapStateToProps)(TodoList);