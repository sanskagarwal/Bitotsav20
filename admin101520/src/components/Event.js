import React from 'react';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: [], eventId: -1, update: 0 };
    }

    componentDidMount = async () => {
        try {
            const url = URL + '/api/admin/getAllEvents';
            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: sessionStorage.getItem('password')
                }),
            });
            const data = await res.json();
            if (data.status !== 200) {
                return alert(data.message);
            }
            this.setState({ events: data.events });
        } catch (e) {
            alert(e);
        }
    }

    handleChange = (e) => {
        this.setState({ eventId: e.target.value });
    }

    getEventById = async () => {
        try {
            const url = URL + '/api/admin/getEventById';
            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: sessionStorage.getItem('password'), eventId: this.state.eventId }),
            });
            const data = await res.json();
            if (data.status !== 200) {
                return alert(data.message);
            }
            console.log(data.event);
        } catch (e) {
            alert(e);
        }
    }

    handleClick1 = (e) => {
        console.log(this.state.eventId);
        this.setState({ update: 0 });
        this.getEventById();
    }

    handleClick2 = (e) => {
        console.log(this.state.eventId);
        this.setState({ update: 1 });
        this.getEventById();
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <h1 style={{ textAlign: "center" }}>Instructions</h1>
                    <hr />
                    <ul>
                        <li>This section is used for updating and viewing details of an event</li>
                        <li>Use the dropout to select the Event Id - Event Name. Details will be displayed below.</li>
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">
                    <div className="form-group">
                        <label htmlFor="eventId">Event Id</label>
                        <select className="form-control" id="eventId" name="eventId" required onChange={this.handleChange} value={this.state.eventId} >
                            <option value="-1">Select an Id</option>
                            {this.state.events.map((res) => {
                                return (
                                    <option key={res.id} value={res.id}>{res.name} - {res.id}</option>
                                )
                            })}
                        </select>
                    </div>
                    <button onClick={this.handleClick1} className="btn btn-success">Show Details</button>
                    <button onClick={this.handleClick2} className="btn btn-warning">Update Event</button>

                    <div className="container-fluid">
                        <div className="font-weight-bold">
                            Name:
                    </div>
                        <div>
                            {this.state.name}
                        </div>
                        <div className="font-weight-bold">
                            Email:
                    </div>
                        <div>
                            {this.state.email}
                        </div>
                        <div className="font-weight-bold">
                            Phone Number:
                    </div>
                        <div>
                            {this.state.phno}
                        </div>
                        <div className="font-weight-bold">
                            College:
                    </div>
                        <div>
                            {this.state.college}
                        </div>
                        <div className="font-weight-bold">
                            Why do you wish to become the Student Ambassador of your college?
                    </div>
                        <div>
                            {this.state.q1}
                        </div>
                        <div className="font-weight-bold">
                            How long have you been enrolled in your college?
                    </div>
                        <div>
                            {this.state.q2}
                        </div>
                        <div className="font-weight-bold">
                            Do you have any other commitments in the month of January-February 2019?
                    </div>
                        <div>
                            {this.state.q3}
                        </div>
                        <div className="font-weight-bold">
                            Do you have any club related experience in your college?
                    </div>
                        <div>
                            {this.state.q4}
                        </div>

                        <div className="font-weight-bold">
                            How many participants can we expect if you are made the Student Ambassador?
                    </div>
                        <div>
                            {this.state.q5}
                        </div>
                    </div>
                    <br />
                    <br />
                </div>
            </div >
        );
    }
}

export default Event; 