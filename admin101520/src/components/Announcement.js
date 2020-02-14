import React from 'react';
import './../css/Announcement.css';

let URL;
if (process.env.NODE_ENV === 'development') {
    URL = 'http://localhost:5000';
} else {
    URL = 'https://bitotsav.in';
}



class Announcement extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errMsg: '', title: '', message: '' };
    }


    handleTitleChange = (e) => {
        const value = e.target.value;
        this.setState({
            title: value
        });
    }

    handleMessageChange = (e) => {
        const value = e.target.value;
        this.setState({
            message: value
        });
    }

    handleResetButtonClick = (e) => {
        this.setState({
            errMsg: '',
            title: '',
            message: ''
        });
    }

    handleFormSubmit = async (e) => {
        try {

            const title = this.state.title;
            const message = this.state.message;



            if(!title || title === ''){
                this.setState({
                    errMsg: 'Missing fields!'
                });
                return;
            }
            if(!message || message === ''){
                this.setState({
                    errMsg: 'Missing fields!'
                });
                return;
            }


            if(title && message) {
                const url = URL + '/api/admin/announcement';
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        password: sessionStorage.getItem('password'),
                        title: title,
                        message: message
                    }),
                });
                const data = await res.json();

                
                if (data.status) {
                    alert(data.message);
                }

                this.setState({
                    errMsg: '',
                    title: '',
                    message: ''
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
                        <li>This section is used for sending announcements.</li>
                    </ul>
                    <hr />
                </div>
                <div className="col-md-8">

                    <div className="form-group">
                            <h2>Compose Announcement:</h2>
                            <hr></hr>
                            <label htmlFor="title">Title: </label>
                            <input className="form-control" id="title" name="title" placeholder="Enter notification title" required onChange={this.handleTitleChange} value={this.state.title} ></input>
                            <br></br>
                            <label htmlFor="message">Message: </label>
                            <input className="form-control" id="message" name="message" placeholder="Enter notification message" required onChange={this.handleMessageChange} value={this.state.message} ></input>
                            <br></br>
                            <p className="errMsg">{this.state.errMsg}</p>
                            <button  onClick={this.handleFormSubmit} className="btn btn-success">Send Announcement</button>
                            <button  onClick={this.handleResetButtonClick} className="btn btn-warning">Reset</button>
                    </div>
    
                </div>
            </div >
        );
    }
}

export default Announcement; 