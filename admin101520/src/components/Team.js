import React from 'react';
import './../css/Team.css';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}


function TableRow (props) {
    return (
        <tr>
            <th scope="row">{props.id}</th>
            <td>{props.name}</td>
            <td>{props.bitId}</td>
            <td>{props.email}</td>
        </tr>
    );
}



class Team extends React.Component {
    constructor(props) {
        super(props);
        this.state = { teamIds: [] ,errMsg: '' ,parameter: 'Team Name' ,nameInput: '' ,idInput: '' ,teamName: '', teamId: '', teamSize: '', teamMembers: [],points: '', leaderName: '', leaderPhoneNo: '', teamVerified: '', teamNameInputDisabled: false , teamIdInputDisabled: true };
    }

    componentDidMount = async () => {
        try {
            const url = URL + '/api/admin/getAllTeamIds';
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
            this.setState({ teamIds: data.teamIds });
        } catch (e) {
            alert(e);
        }
    }


    handleSearchMethodChange = (e) => {
        const parameter = e.target.value;
        if(parameter === 'Team Name'){
            this.setState({
                parameter: parameter,
                idInput: '',
                teamNameInputDisabled: false,
                teamIdInputDisabled: true
            });
        }
        else if(parameter === 'Team Id'){
            // console.log(this.state);
            this.setState({
                parameter: parameter,
                nameInput: '',
                teamNameInputDisabled: true,
                teamIdInputDisabled: false
            });
        }
        else {
            alert("Some error occured!");
        }
    }


    handleInputChange = (e) => {
        const value = e.target.value;
        const parameter = this.state.parameter;
        if(parameter === 'Team Name'){
            this.setState({
                nameInput: value,
                teamNameInputDisabled: false

            });
        }
        if(parameter === 'Team Id'){
            this.setState({
                idInput: value,
                teamNameInputDisabled: true
            });
        }
        
    }

    handleTeamIdChange = (e) => {
        const value = e.target.value;
        this.setState({
            idInput: value
        });
    }

    handleResetButtonClick = (e) => {
        this.setState({
            teamName: '',
            teamId: '',
            teamSize: '',
            teamMembers: [],
            points: '',
            leaderName: '',
            leaderPhoneNo: '',
            idInput: '',
            nameInput: '',
            errMsg: '',
            teamVerified: '',
            parameter: 'Team Name'
        });
    }

    handleFormSubmit = async (e) => {
        try {
            // console.log(this.state);

            const parameter = this.state.parameter;
            const idInput = this.state.idInput;
            const nameInput = this.state.nameInput;



            if(!parameter || parameter === ''){
                this.setState({
                    errMsg: 'Missing fields!'
                });
                return;
            }
            if((!idInput || idInput === '')&&(!nameInput || nameInput === '')){
                this.setState({
                    errMsg: 'Missing fields!'
                });
                return;
            }


            if(parameter && (idInput || nameInput)) {
                const url = URL + '/api/admin/getTeam';
                let res = null;
                if(parameter === 'Team Name'){
                    res = await fetch(url, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            password: sessionStorage.getItem('password'),
                            parameter: parameter,
                            paramValue: nameInput
                        }),
                    });
                }
                if(parameter === 'Team Id'){
                    res = await fetch(url, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            password: sessionStorage.getItem('password'),
                            parameter: parameter,
                            paramValue: idInput
                        }),
                    });
                }
                
                const data = await res.json();

                // console.log(data);

                if(data.team === null || data.team === []) {
                    return alert("No team found with provided credentials!");
                }
                if (data.status !== 200) {
                    return alert(data.message);
                }
                const team = data.team;
                this.setState({ 
                    teamName: team.teamName,
                    teamId: team.teamId,
                    teamSize: team.teamSize,
                    teamMembers: team.teamMembers,
                    points: team.points,
                    leaderName: team.leaderName,
                    leaderPhoneNo: team.leaderPhoneNo,
                    paramValue: team.paramValue,
                    errMsg: '',
                    teamVerified: team.teamVerified
                });
            }
            
        } catch (e) {
            alert("Invalid credentials!");
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <h1 style={{ textAlign: "center" }}>Instructions</h1>
                    <hr />
                    <ul>
                        <li>This section is used for viewing the details of a team.</li>
                        <li>Use the dropdown to select if you want to search the team by Team Name or Team Id.</li>
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">

                    <div className="form-group">
                            <label htmlFor="teamSearchMethod">Select if you want to search team by Team Name or Team Id: </label>
                            <select className="form-control" id="teamSearchMethod" name="teamSearchMethod"  required onChange={this.handleSearchMethodChange} value={this.state.parameter} >
                                <option value="Team Id">Team Id</option>
                                <option value="Team Name">Team Name</option>
                            </select>
                            <br></br>
                            <input className="form-control" disabled={this.state.teamNameInputDisabled} placeholder='Enter the team name' value={this.state.nameInput} onChange={this.handleInputChange}></input>
                            <br></br>
                            
                            <label htmlFor="teamIdSelect">Select Team Id: </label>
                            <select className="form-control" id="teamIdSelect" disabled={this.state.teamIdInputDisabled} name="teamIds" required onChange={this.handleTeamIdChange} value={this.state.idInput} >
                                <option value="0">Select an Id</option>
                                {this.state.teamIds.map((team) => {
                                    return (
                                        <option key={team.teamId} value={team.teamId}>{team.teamId}</option>
                                    )
                                })}
                            </select>
                            <br></br>
                            <p className="errMsg">{this.state.errMsg}</p>
                            <button  onClick={this.handleFormSubmit} className="btn btn-primary">Show Team Details</button>
                            <button  onClick={this.handleResetButtonClick} className="btn btn-warning">Reset</button>
                    </div>
                    <hr></hr>

                    

                    <div className="container-fluid">
                        <div className="font-weight-bold">
                            Team Name:
                        </div>
                        <div>
                            {this.state.teamName}
                        </div>

                        <div className="font-weight-bold">
                            Team Verified:
                        </div>
                        <div>
                            {this.state.teamVerified === true? 'Yes' : ''}
                            {this.state.teamVerified === false? 'No' : ''}
                        </div>

                        <div className="font-weight-bold">
                            Team Id:
                        </div>
                        <div>
                            {this.state.teamId}
                        </div>

                        <div className="font-weight-bold">
                            Team Size:
                        </div>
                        <div>
                            {this.state.teamSize}
                        </div>

                        <div className="font-weight-bold">
                            Points: 
                        </div>
                        <div>
                            {this.state.points}
                        </div>

                        <div>
                            <hr></hr>
                            <h3>Team Leader Details: </h3>
                            <br></br>
                        </div>

                        <div className="font-weight-bold">
                            Name:
                        </div>
                        <div>
                            {this.state.leaderName}
                        </div>


                        <div className="font-weight-bold">
                            Phone Number:
                        </div>
                        <div>
                            {this.state.leaderPhoneNo}
                        </div>

                        <div>
                            <hr></hr>
                            <h3>Team Members: </h3>
                            <br></br>
                        </div>

                        <div>
                                <table className="table table-striped">
                                    <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Bitotsav Id</th>
                                        <th scope="col">Email</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    
                                        {this.state.teamMembers.map((member, index)=><TableRow key={member.email} id={index+1} name={member.name} bitId={member.bitotsavId} email={member.email}></TableRow>) }
                                    
                                    </tbody>
                            </table>
                        </div>

                    </div>
                    <br />
                    <br />
                </div>
            </div >
        );
    }
}

export default Team; 