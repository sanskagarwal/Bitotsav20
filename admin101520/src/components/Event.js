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

        this.state = { sapValue: "0", name: "", email: "", phno: "", college: "", q1: "", q2: "", q3: "", q4: "", q5: "", saps: [] };
    }

    componentDidMount = async () => {
        try {
            const url = URL + '/api/admin/getAllSaps';
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
            this.setState({ saps: data.saps });
        } catch (e) {
            alert(e);
        }
    }

    handleChange = (e) => {
        this.setState({ sapValue: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = URL + '/api/admin/getSapById';
            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: sessionStorage.getItem('password'), sapId: this.state.sapValue }),
            });
            const data = await res.json();
            if (data.status !== 200) {
                return alert(data.message);
            }
            const sapData = data.saps;
            this.setState({ name: sapData.name, email: sapData.email, college: sapData.college, phno: sapData.phone, q1: sapData.ans1, q2: sapData.ans2, q3: sapData.ans3, q4: sapData.ans4, q5: sapData.ans5 });
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
                        <li>This section is to check SAP details</li>
                        <li>Use the dropout to select the SAP Id. Details will be displayed below.</li>
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="SAPId">SAP Id</label>
                            <select className="form-control" id="sapId" name="SAPId" required onChange={this.handleChange} value={this.state.sapValue} >
                                <option value="0">Select an Id</option>
                                {this.state.saps.map((res) => {
                                    return (
                                        <option key={res.sapId} value={res.sapId}>{res.sapId} - {res.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">Get Info</button>
                    </form >

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

export default Sap; 