import React from 'react';
import './../css/User.css';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errMsg: '' ,inputType: 'email' ,parameter: 'Email' ,paramValue: '' ,name: '', email: '', phoneNo: '', bitotsavId: '', clgName: '', clgId: '', clgCity: '', clgState: '' };
    }


    handleSearchMethodChange = (e) => {
        const parameter = e.target.value;
        if(parameter === 'Email'){
            this.setState({
                parameter: parameter,
                inputType: 'email'
            });
        }
        else if(parameter === 'Bitotsav Id'){
            console.log(this.state);
            this.setState({
                parameter: parameter,
                inputType: 'number'
            });
        }
        else {
            alert("Some error occured!");
        }
    }


    handleInputChange = (e) => {
        const value = e.target.value;
        this.setState({
            paramValue: value
        });
    }

    handleResetButtonClick = (e) => {
        this.setState({
            name: '',
            email: '',
            phoneNo: '',
            bitotsavId: '',
            clgName: '',
            clgId: '',
            clgCity: '',
            clgState: '',
            paramValue: '',
            errMsg: ''
        });
    }

    handleFormSubmit = async (e) => {
        try {
            console.log(this.state);

            const parameter = this.state.parameter;
            const paramValue = this.state.paramValue;



            if(!parameter || parameter === ''){
                this.setState({
                    errMsg: 'Missing fields!'
                });
                return;
            }
            if(!paramValue || paramValue === ''){
                this.setState({
                    errMsg: 'Missing fields!'
                });
                return;
            }


            if(paramValue && parameter) {
                const url = URL + '/api/admin/getUser';
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        password: sessionStorage.getItem('password'),
                        parameter: parameter,
                        paramValue: paramValue
                    }),
                });
                const data = await res.json();

                // console.log(data);

                if(data.user === null || data.user === []) {
                    return alert("No user found with provided credentials!");
                }
                if (data.status !== 200) {
                    return alert(data.message);
                }
                const user = data.user;
                this.setState({ 
                    name: user.name,
                    email: user.email,
                    phoneNo: user.phoneNo,
                    bitotsavId: user.bitotsavId,
                    clgName: user.clgName,
                    clgId: user.clgId,
                    clgCity: user.clgCity,
                    clgState: user.clgState,
                    errMsg: ''
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
                        <li>This section is used for viewing the details of a user.</li>
                        <li>Use the dropdown to select if you want to search the user by Email or Bitotsav Id.</li>
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">

                    <div className="form-group">
                            <label htmlFor="userSearchMethod">Select if you want to search user by Email or Bitotsav Id: </label>
                            <select className="form-control" id="userSearchMethod" name="userSearchMethod"  required onChange={this.handleSearchMethodChange} value={this.state.parameter} >
                                <option value="Email">Email</option>
                                <option value="Bitotsav Id">Bitotsav Id</option>
                            </select>
                            <br></br>
                            <input className="form-control" type={this.state.inputType} placeholder={`Enter the user's ${this.state.parameter === 'Email' ? 'Email' : 'Bitotsav Id'} `} value={this.state.paramValue} onChange={this.handleInputChange}></input>
                            <br></br>
                            <p className="errMsg">{this.state.errMsg}</p>
                            <button  onClick={this.handleFormSubmit} className="btn btn-primary">Show user details</button>
                            <button  onClick={this.handleResetButtonClick} className="btn btn-warning">Reset</button>
                    </div>
                    <hr></hr>

                    

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
                            {this.state.phoneNo}
                        </div>

                        <div className="font-weight-bold">
                            Bitotsav Id:
                        </div>
                        <div>
                            {this.state.bitotsavId}
                        </div>

                        <div className="font-weight-bold">
                            Institute Name:
                        </div>
                        <div>
                            {this.state.clgName}
                        </div>

                        <div className="font-weight-bold">
                            Institute Roll Number:
                        </div>
                        <div>
                            {this.state.clgId}
                        </div>

                        <div className="font-weight-bold">
                            Institute City:
                        </div>
                        <div>
                            {this.state.clgCity}
                        </div>

                        <div className="font-weight-bold">
                            Institute State:
                        </div>
                        <div>
                            {this.state.clgState}
                        </div>

                    </div>
                    <br />
                    <br />
                </div>
            </div >
        );
    }
}

export default User; 