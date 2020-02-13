import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { password: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        sessionStorage.setItem('password', this.state.password);
        this.props.updatePage(true);
    }

    handleChange(e) {
        this.setState({ password: e.target.value });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                    </div>
                    <div className="col-md-4">
                        {(this.props.loggedIn && <p><span style={{color: "green"}}>Logged In Successfully!</span>  <br />Actually, you may not be logged in, make sure you have entered the password correctly. <br /><strong>Why?</strong> <br /> I am too lazy to fix it :)</p>) ||
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" required onChange={this.handleChange} value={this.state.password} />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Login; 