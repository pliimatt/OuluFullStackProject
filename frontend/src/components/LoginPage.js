import React from 'react';
import {Form, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {register, login} from '../actions/loginActions';

class LoginPage extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit = (event) => {
        let user = {
            ...this.state
        }
        if (event.target.name === "register") {
            this.props.dispatch(register(user));
        } else {
            this.props.dispatch(login(user));
        }
    }

    render () {
        let loginStyle = {
            width: 500,
            margin: "auto"
        }
        return (
            <div style={loginStyle}>
                <Form>
                    <Form.Field>
                        <label htmlFor="username">Username</label>
                        <input type="text"
                            name="username"
                            onChange={this.onChange}
                            value={this.state.username} />
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            name="password"
                            onChange={this.onChange}
                            value={this.state.password} />
                    </Form.Field>
                    <Button name="register" onClick={this.onSubmit}>Register</Button>
                    <Button name="login" onClick={this.onSubmit}>Login</Button>
                </Form>
            </div>
        )
    }

}

export default connect()(LoginPage);