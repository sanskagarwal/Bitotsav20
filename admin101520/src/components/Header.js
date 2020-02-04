import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    logout = () => {
        sessionStorage.removeItem('password');
        this.props.updatePage(false);
    }
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark" style={{ marginBottom: "50px" }}>
                <div className="container">
                    <div className="navbar-brand"><img alt="BIT Logo" width="30" height="30" src="./logo.png" /></div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/"> Login </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sap"> SAP </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/event"> Event </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/user"> User </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/team"> Team </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/eventParticipants"> Event Participants </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/stats"> Stats </Link>
                            </li>
                        </ul>

                        <ul className="navbar-nav nav ml-auto">
                            {
                                this.props.loggedIn &&
                                <li className="nav-item">
                                    <button className='btn btn-outline-primary nav-link' onClick={this.logout}> Logout </button>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header; 