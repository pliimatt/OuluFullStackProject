import React from 'react'
import {Button, Checkbox} from 'semantic-ui-react';

class TodoListItem extends React.Component {

    toggle = () => {
        let item = {
            ...this.props.item,
            isDone: !this.props.item.isDone
        }
        this.props.editItem(item);
    }

    render () {
        let deadLineString = "";
        if (this.props.item.deadLine) {
            let deadlineDate = new Date(this.props.item.deadLine)
            deadLineString = deadlineDate.getDate() + "." + (deadlineDate.getMonth() + 1) + "." + deadlineDate.getFullYear()
            if (!this.props.item.isDone && deadlineDate < new Date()) {
                deadLineString = "Late (" + deadLineString + ")"
            }
        }
        let done = this.props.item.isDone
        return (
            <div className="row">
                <div className="two wide column">
                    <Checkbox checked={done} onChange={this.toggle} />
                </div>
                <div className="four wide column">
                    <p>{deadLineString}</p>
                </div>
                <div className="six wide column">
                    <p>{this.props.item.todo}</p>
                </div>
                <div className="four wide column">
                    {done ?
                        <Button color="red"
                            onClick={() => this.props.changeToRemoveMode(this.props.index)}>Remove</Button> :
                        <Button color="blue"
                            onClick={() => this.props.changeToEditMode(this.props.index)}>Edit</Button>
                    }
                </div>
            </div>
        )
    }
}

export default TodoListItem
