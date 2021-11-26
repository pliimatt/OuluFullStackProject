import React from 'react'
import {Button, Checkbox} from 'semantic-ui-react';

class RemoveRow extends React.Component {

    render () {
        let item = this.props.item
        return (
            <div className="row">
                <div className="two wide column">
                    <Checkbox checked={this.props.item.isDone} />
                </div>
                <div className="ten wide column">
                    <p>{this.props.item.todo}</p>
                </div>
                <div className="four wide column">
                    <Button.Group>
                        <Button color="red" onClick={() => this.props.cancel()}>Cancel</Button>
                        <Button color="green" onClick={() => this.props.removeFromList(item._id)}>Confirm</Button>
                    </Button.Group>
                </div>
            </div>
        )
    }
}

export default RemoveRow
