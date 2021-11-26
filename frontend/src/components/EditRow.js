import React from 'react'
import {Button, Checkbox} from 'semantic-ui-react';

class EditRow extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            todo: props.item.todo,
            deadLine: props.item.deadLine,
            isDone: props.item.isDone
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit = (event) => {
        let item = {
            ...this.state,
            _id: this.props.item._id
        }
        this.props.editItem(item);
    }

    render () {
        return (
            <div className="row">
                <div className="two wide column">
                    <Checkbox checked={this.state.isDone} onChange={() => this.setState({isDone: !this.state.isDone})} />
                </div>
                <div className="four wide column">
                    <input type="Date"
                        name={"deadLine"}
                        onChange={this.onChange}
                        value={this.state.deadLine} />
                </div>
                <div className="six wide column">
                    <input type="text"
                        name="todo"
                        onChange={this.onChange}
                        value={this.state.todo} />
                </div>
                <div className="four wide column">
                    <Button.Group>
                        <Button color="green" onClick={() => this.onSubmit()}>Save</Button>
                        <Button color="red" onClick={() => this.props.cancel()}>Cancel</Button>
                    </Button.Group>
                </div>
            </div>
        )
    }
}

export default EditRow
