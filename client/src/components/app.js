import React, {Component} from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage'
import Authentication from './Authentication'
import Auth from '../utils/auth';
class App extends Component {
    state = {
        token: Auth.getToken()
    }

    componentDidMount() {
        Auth.onAuthChange(this.handleAuthChange)
    }

    handleAuthChange = token => {
        this.setState({
            token
        })
    }

    render() {
        return (

            <BrowserRouter>
                <div>
                    <header>
                        <Authentication token={this.state.token} />
                    </header>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/login" render={() => <LoginPage token={this.state.token} />}/>
                    <PrivateRoute path="/dashboard" component={DashboardPage} token={this.state.token}/>

                </div>
            </BrowserRouter>
        )
    }
}
const PrivateRoute = ({ component: Component, token, ...rest }) => (
    <Route {...rest} render={props => (
        token ? (
            <Component {...props} token={token} />
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />
)
export default App;