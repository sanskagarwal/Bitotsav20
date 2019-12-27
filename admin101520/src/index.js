import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Login from "./components/Login";
import Sap from "./components/Sap";
import Logout from "./components/Logout";


class App extends React.Component {
    constructor(props) {
        super(props);
        if (!sessionStorage.getItem('password')) {
            this.state = { loggedIn: false };
        }
        else {
            this.state = { loggedIn: true };
        }
    }

    updatePage = (loggedIn) => {
        this.setState({ loggedIn: loggedIn });
    }

    render() {
        return (
            <Router>
                <Header updatePage={this.updatePage} loggedIn={this.state.loggedIn} />
                <div className="container">
                    <Route exact path="/" render={(props) => <Login updatePage={this.updatePage} loggedIn={this.state.loggedIn} />} />
                    <Route path="/sap" component={Sap} />
                    <Route path="/logout" component={Logout} />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));