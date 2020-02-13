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
        this.state = { 
            teamIds: [],
            errMsg: '',
            parameter: 'Team Name',
            nameInput: '',
            idInput: '' ,
            teamName: '',
            teamId: '',
            teamSize: '',
            teamMembers: [],
            points: '', 
            leaderName: '', 
            leaderPhoneNo: '', 
            teamVerified: '', 
            teamNameInputDisabled: false , 
            teamIdInputDisabled: true, 
            verifyTeamDisabled: true , 
            searchSelectDisabled: false,
            pointsToAdd: '',
            pointsAddInputDisabled: true,
            pointsAddButtonDisabled: true
        };
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
            parameter: 'Team Name',
            verifyTeamDisabled: true,
            searchSelectDisabled: false,
            teamIdInputDisabled: true,
            teamNameInputDisabled: false,
            pointsToAdd: '',
            pointsAddInputDisabled: true,
            pointsAddButtonDisabled: true
        });
    }


    handleVerifyButtonClick = async(e) => {
        try {
            const teamId = this.state.teamId;
            const teamName = this.state.teamName;

            // const msg = 'Are you sure you want to verify team '+teamName+ ' ? ';
            // const sign = prompt(msg);

            if(teamName === '' || teamId === ''){
                alert('Missing fields!');
            }

            const url = URL + '/api/admin/verifyTeam';

            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: sessionStorage.getItem('password'),
                    teamName: teamName,
                    teamId: teamId
                }),
            });

            const data = await res.json();
            
            if(data.status === 200) {
                alert(data.message);
                this.setState({
                    errMsg: '' ,
                    parameter: 'Team Name' ,
                    nameInput: '' ,
                    idInput: '' ,
                    teamName: '',
                    teamId: '', 
                    teamSize: '', 
                    teamMembers: [],
                    points: '', 
                    leaderName: '', 
                    leaderPhoneNo: '', 
                    teamVerified: '', 
                    teamNameInputDisabled: false , 
                    teamIdInputDisabled: true, 
                    verifyTeamDisabled: true,
                    searchSelectDisabled: false
                });
            }
            else{
                alert(data.message);
            }
        }
        catch(e) {
            alert(e);
        }
    }

    pointsAddInputChange = (e) => {
        this.setState({
            pointsToAdd: e.target.value
        });
    }


    pointsAddButtonClick = async (e) => {
        try {
            const teamId = (this.state.teamId).toString().trim();
            const teamName = (this.state.teamName).toString().trim();
            const currentPoints = (this.state.points).toString().trim();
            const pointsToAdd = (this.state.pointsToAdd).toString().trim();

            if(!teamName || teamName === ''){
                return alert('Missing fields!');
            }
            if(!teamId || teamId === ''){
                return alert('Missing fields!');
            }
            if(!currentPoints || currentPoints === ''){
                return alert('Missing fields!');
            }
            if(!pointsToAdd || pointsToAdd === ''){
                return alert('Missing fields!');
            }

            if(isNaN(teamId)){
                return alert('Team id must be a number!');
            }
            if(isNaN(currentPoints)){
                return alert('Current team points must be a number!');
            }
            if(isNaN(pointsToAdd)){
                return alert('Points to be added must be a number!');
            }


            const url = URL + '/api/admin/addPoints';

            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: sessionStorage.getItem('password'),
                    teamName: teamName,
                    teamId: teamId,
                    currentPoints: currentPoints,
                    pointsToAdd: pointsToAdd
                }),
            });

            const data = await res.json();
            
            if(data.status === 200) {
                alert(data.message);
                this.setState({
                    errMsg: '' ,
                    parameter: 'Team Name' ,
                    nameInput: '' ,
                    idInput: '' ,
                    teamName: '',
                    teamId: '', 
                    teamSize: '', 
                    teamMembers: [],
                    points: '', 
                    leaderName: '', 
                    leaderPhoneNo: '', 
                    teamVerified: '', 
                    teamNameInputDisabled: false , 
                    teamIdInputDisabled: true, 
                    verifyTeamDisabled: true,
                    searchSelectDisabled: false,
                    pointsToAdd: '',
                    pointsAddInputDisabled: true,
                    pointsAddButtonDisabled: true
                });
            }
            else{
                alert(data.message);
                this.setState({
                    pointsToAdd: '',
                    pointsAddInputDisabled: false,
                    pointsAddButtonDisabled: false
                });
            }
        }
        catch(e) {
            alert(e);
            this.setState({
                errMsg: '' ,
                parameter: 'Team Name' ,
                nameInput: '' ,
                idInput: '' ,
                teamName: '',
                teamId: '', 
                teamSize: '', 
                teamMembers: [],
                points: '', 
                leaderName: '', 
                leaderPhoneNo: '', 
                teamVerified: '', 
                teamNameInputDisabled: false , 
                teamIdInputDisabled: true, 
                verifyTeamDisabled: true,
                searchSelectDisabled: false,
                pointsToAdd: '',
                pointsAddInputDisabled: true,
                pointsAddButtonDisabled: true
            });
        }
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

                if(team.teamVerified === true){
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
                        teamVerified: team.teamVerified,
                        teamIdInputDisabled: true,
                        teamNameInputDisabled: true,
                        searchSelectDisabled: true,
                        pointsToAdd: '',
                        pointsAddInputDisabled: false,
                        pointsAddButtonDisabled: false
                    });
                }
                else{
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
                        teamVerified: team.teamVerified,
                        verifyTeamDisabled: false,
                        teamIdInputDisabled: true,
                        teamNameInputDisabled: true,
                        searchSelectDisabled: true,
                        pointsToAdd: '',
                        pointsAddInputDisabled: true,
                        pointsAddButtonDisabled: true
                    });
                }
                
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
                        <li>This section is used for viewing the details of a team and then verifying the team if all details are correct.</li>
                        <li>Use the dropdown to select if you want to search the team by Team Name or Team Id.</li>
                        <li>Once the team details have been obtained, see if the team details are same as in the documents provided by team members. Click on "Verify Team" if details are correct.</li>
                        <li>Once a team is verified, points can be added after the team details appear.</li>                    
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">

                    <div className="form-group">
                            <label htmlFor="teamSearchMethod">Select if you want to search team by Team Name or Team Id: </label>
                            <select disabled={this.searchSelectDisabled} className="form-control" id="teamSearchMethod" name="teamSearchMethod"  required onChange={this.handleSearchMethodChange} value={this.state.parameter} >
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
                            <button  onClick={this.handleVerifyButtonClick} className="btn btn-success" disabled={this.state.verifyTeamDisabled}>Verify Team</button>
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
                        
                        <br></br><br></br>
                        <div className="form-group">
                            <label htmlFor="pointsAddInput">Enter the points to add to team <strong>{this.state.teamName}</strong>: </label>
                            <input id="pointsAddInput" className="form-control" disabled={this.state.pointsAddInputDisabled} placeholder='Enter the points to add' value={this.state.pointsToAdd} onChange={this.pointsAddInputChange}></input>
                            <br></br>
                            <button  onClick={this.pointsAddButtonClick} className="btn btn-success" disabled={this.state.pointsAddButtonDisabled}>Add points</button>
                            <br></br>
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