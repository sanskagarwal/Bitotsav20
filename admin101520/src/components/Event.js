import React from 'react';
import './../css/Event.css';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}

let eventWinners = ['', '', '']

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: [], eventId: -1, update: 0, points: '', venue: '', description: '', rulesAndRegulations: '', contactInformation: '', duration: '', cashPrize: '', _id: '', dummy1: '', eventDetails: {} };
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
        this.setState({ eventId: e.target.value, update: 0 });
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
            const event = data.event;
            if (event.dummy1) {
                eventWinners = event.dummy1.split("!@#$%");
            }
            this.setState({ eventDetails: event, points: event.points, _id: event._id, venue: event.venue, description: event.description, rulesAndRegulations: event.rulesAndRegulations, contactInformation: event.contactInformation, duration: event.duration, cashPrize: event.cashPrize });
        } catch (e) {
            alert(e);
        }
    }

    handleClick1 = (e) => {
        console.log(this.state.eventId);
        eventWinners = ['', '', ''];
        this.setState({ update: 0 });
        this.getEventById();
    }

    handleClick2 = (e) => {
        console.log(this.state.eventId);
        eventWinners = ['', '', ''];
        this.setState({ update: 1 });
        this.getEventById();
    }

    handleFormChange = (e) => {
        let nam = e.target.name;
        let val = e.target.value;
        if (nam.includes("eventWinners")) {
            let num = Number(nam.slice(-1));
            eventWinners[num] = val;
            this.setState({ dummy1: eventWinners.join("!@#$%") });
        } else {
            this.setState({ [nam]: val });
        }
    }

    handleFormSubmit = async (e) => {
        console.log(this.state.eventWinners);
        try {
            const url = URL + '/api/admin/updateEventById';
            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: sessionStorage.getItem('password'),
                    _id: this.state._id,
                    points: this.state.points,
                    venue: this.state.venue,
                    description: this.state.description,
                    rulesAndRegulations: this.state.rulesAndRegulations,
                    contactInformation: this.state.contactInformation,
                    duration: this.state.duration,
                    cashPrize: this.state.cashPrize,
                    dummy1: eventWinners.join("!@#$%")
                }),
            });
            const data = await res.json();
            if (data.status !== 200) {
                return alert(data.message);
            }
            alert(data.message);
            this.setState({ update: 0 });
        } catch (e) {
            alert(e);
        }
    }

    render() {
        return (
            <div>
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
                        <button onClick={this.handleClick1} className="btn btn-info">Show Details</button>
                        <button onClick={this.handleClick2} className="btn btn-warning">Update Event</button>

                        <div className="container-fluid">
                            <div className="font-weight-bold">
                                Name:
                    </div>
                            <div>
                                {this.state.eventDetails.name}
                            </div>
                            <div className="font-weight-bold">
                                Event Category:
                    </div>
                            <div>
                                {this.state.eventDetails.eventCategory}
                            </div>
                            <div className="font-weight-bold">
                                Venue:
                    </div>
                            <div>
                                {this.state.update === 1 ? (<input type="text" name="venue" value={this.state.venue} onChange={this.handleFormChange} />) : this.state.eventDetails.venue}
                            </div>
                            <div className="font-weight-bold">
                                Points:
                    </div>
                            <div>
                                {this.state.update === 1 ? (<input type="text" name="points" value={this.state.points} onChange={this.handleFormChange} />) : this.state.eventDetails.points}
                            </div>
                            <div className="font-weight-bold">
                                Cash Prizes
                    </div>
                            <div>
                                {this.state.update === 1 ? (<input type="text" name="cashPrize" value={this.state.cashPrize} onChange={this.handleFormChange} />) : this.state.eventDetails.cashPrize}
                            </div>
                            <div className="font-weight-bold">
                                Duration
                            </div>
                            <div>
                                {this.state.update === 1 ? (<input type="text" name="duration" value={this.state.duration} onChange={this.handleFormChange} />) : this.state.eventDetails.duration}
                            </div>
                            <div className="font-weight-bold">
                                Event Winners
                            </div>
                            <div>
                                {
                                    this.state.update === 1 ?
                                        (<div>
                                            <div>First Place
                                                <input type="text" name="eventWinners0" value={eventWinners[0]} onChange={this.handleFormChange} />
                                            </div>
                                            <div>Second Place
                                                <input type="text" name="eventWinners1" value={eventWinners[1]} onChange={this.handleFormChange} />
                                            </div>
                                            <div>Third Place
                                                <input type="text" name="eventWinners2" value={eventWinners[2]} onChange={this.handleFormChange} />
                                            </div>
                                        </div>)
                                        :
                                        eventWinners.join()
                                }
                            </div>
                            <div className="font-weight-bold">
                                Description
                    </div>
                            <div>
                                {this.state.update === 1 ? (<textarea rows="10" name="description" value={this.state.description} onChange={this.handleFormChange} />) : this.state.eventDetails.description}
                            </div>
                            <div className="font-weight-bold">
                                Rules and Regulations
                    </div>
                            <div>
                                {this.state.update === 1 ? (<textarea rows="10" name="rulesAndRegulations" value={this.state.rulesAndRegulations} onChange={this.handleFormChange} />) : this.state.eventDetails.rulesAndRegulations}
                            </div>

                            <div className="font-weight-bold">
                                Contact Information
                    </div>
                            <div>
                                {this.state.update === 1 ? (<textarea rows="2" name="contactInformation" value={this.state.contactInformation} onChange={this.handleFormChange} />) : this.state.eventDetails.contactInformation}
                            </div>
                            {this.state.update === 1 && <button onClick={this.handleFormSubmit} className="btn btn-success">Update</button>}
                        </div>
                        <br />
                        <br />
                    </div>
                </div >
            </div>
        );
    }
}

export default Event; 