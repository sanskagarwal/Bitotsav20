import React from 'react';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}

class SMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = { phoneNo: "", message: "" };
    }

    handleChange = (e) => {
        let nam = e.target.name;
        let val = e.target.value;
        this.setState({ [nam]: val });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = URL + '/api/admin/sendSMS';
            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: sessionStorage.getItem('password'), phoneNo: this.state.phoneNo, message: this.state.message }),
            });
            const data = await res.json();
            if (data.status !== 200) {
                return alert(data.message);
            }
            alert(data.message);
            this.setState({ phoneNo: "", message: "" });
        } catch (e) {
            alert(e);
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <h1 style={{ textAlign: "center" }}>Instructions</h1>
                    <hr />
                    <ul>
                        <li>This section is used to send SMS with JD-BITOSV.</li>
                        <li>Phone number must be 10 digits long.</li>
                        <li>Message must contain maximum 140 characters.</li>
                        <li>Current cost of each SMS: Rs. 0.30.</li>
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">
                    <div className="container-fluid">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="phoneNo">Phone Number</label>
                                <input type="text" name="phoneNo" id="phoneNo" value={this.state.phoneNo} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea rows="5" name="message" value={this.state.message} onChange={this.handleChange} />
                            </div>
                            <button type="submit" className="btn btn-warning">Send</button>
                        </form >
                    </div>
                </div>
            </div>
        );
    }
}

export default SMS; 