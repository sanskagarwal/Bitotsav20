import React from 'react';
import './../css/Feedback.css';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}


function SingleMsg(props) {
    const msg = props.msg;
    return (
        <div className="card text-dark bg-light mb-3">
            <div className="card-header">
                <p><strong>Subject: </strong>{msg.subject}</p>
            </div>
            <div className="card-body">
                <p><strong>Body: </strong></p>
                <p className="card-text">{msg.message}</p>
            </div>
            <div className="card-footer text-right">
                <p><strong>Name: </strong>{msg.name}</p>
                <p><strong>Email: </strong>{msg.email}</p>
            </div>
        </div>
    )
}


class Feedbacks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }

    componentDidMount = async () => {
        try {
            const url = URL + '/api/admin/getMessages';
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
            this.setState({  
                messages: data.feedbacks 
            });
        } catch (e) {
            alert(e);
        }
    }



    handleRefresh = async (e) => {
        try {
            const url = URL + '/api/admin/getMessages';
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
            this.setState({ messages: data.feedbacks });
        } catch (e) {
            alert(e);
        }
    }




    render() {
        console.log(this.state);
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h1 style={{ textAlign: "center" }}>Instructions</h1>
                        <hr />
                        <ul>
                            <li>This section is used for viewing the feedbacks or messages sent through contact us form on the main page.</li>
                            <li>You can click on "Refresh" button once in a while to see if new feedbacks have come.</li>
                            <li>But do not click on "Refresh" button too frequently.</li>
                        </ul>
                        <hr />
                    </div>
                    <div className="col-md-8">
                        <button className="btn btn-warning" onClick={this.handleRefresh}>Refresh</button>
                        <hr></hr>
                        
                        <div className="container">
                            {this.state.messages.map((msg, index)=>{return <SingleMsg key={msg.email+index} msg={this.state.messages[index]}></SingleMsg>})}
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default Feedbacks; 