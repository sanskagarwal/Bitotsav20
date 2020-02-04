import React from 'react';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = { totalUsers: 0, bitUsers: 0, outsideUsers: 0, teamCount: 0 };
    }

    componentDidMount = async () => {
        try {
            const url = URL + '/api/admin/getStats';
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
            this.setState({ totalUsers: data.totalUsers, bitUsers: data.bitUsers, outsideUsers: data.outsideUsers, teamCount: data.teamCount });
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
                        <li>This section is to check Statistics of Bitotsav Regsitrations</li>
                        <li>Wait a second to let the stats load.</li>
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">
                    <div className="container-fluid">
                        <div className="font-weight-bold">
                            Total Users: {this.state.totalUsers}
                        </div>
                        <div className="font-weight-bold">
                            BIT Users: {this.state.bitUsers}
                        </div>
                        <div className="font-weight-bold">
                            Outside Users: {this.state.outsideUsers}
                        </div>
                        <div className="font-weight-bold">
                            Team Count: {this.state.teamCount}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Stats; 