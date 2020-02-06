import React from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}

class EventParticipants extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: [], eventId: -1, sel: 0, teams: [] };
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

    handleClick = async (e) => {
        console.log(this.state.eventId);
        try {
            const url = URL + '/api/admin/getTeamsByEventId';
            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: sessionStorage.getItem('password'), eventId: this.state.eventId }),
            });
            const data = await res.json();
            if (data.status !== 200) {
                return alert(data.message);
            }
            console.log(data.teams);
            this.setState({ teams: data.teams, sel: 1 });
            // const event = data.event;
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
                            <li>This section is used to view to teams for a given event</li>
                            <li>Use the dropout to select the Event Id - Event Name. Details will be displayed below.</li>
                            <li>Click on the Download button to get the team list once it is fetched</li>
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
                        <button onClick={this.handleClick} className="btn btn-info">Show Details</button>
                        {
                            this.state.sel === 1 && <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="text-center btn btn-success download-table-xls-button"
                            table="teamDetails"
                            filename="teamDetailsxls"
                            sheet="teamDetailsxls"
                            buttonText="Download as XLS" />
                        }
                        <table id="teamDetails" className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Team Id</th>
                                    <th scope="col">Team Name</th>
                                    <th scope="col">Leader Name</th>
                                    <th scope="col">Leader Phone</th>
                                    <th scope="col">Member Details</th>
                                    <th scope="col">College Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.sel === 1 && (this.state.teams.map((res, ind) => {
                                        const members = res.teamMembers.map((mem) => {
                                            return (
                                                <li>{mem.email} - {mem.bitotsavId}</li>
                                            );
                                        });
                                        return (
                                            <tr>
                                                <th>{ind + 1}</th>
                                                <td>{res.teamId}</td>
                                                <td>{res.teamName}</td>
                                                <td>{res.leaderName}</td>
                                                <td>{res.leaderPhoneNo}</td>
                                                <td>{members}</td>
                                                <td>{res.college}</td>
                                            </tr>
                                        )
                                    }))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default EventParticipants; 