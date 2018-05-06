import React, { Component } from 'react';
import './EmailForm.css';
import FormErrors from './FormErrors';
import axios from 'axios';

class EmailForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      to_email: "",
      cc_email: "",
      bcc_email: "",
      subject: "",
      message: "",
      formErrors: {to_email: '', subject: '', message: '' },
      emailValid: false,
      subjectValid: false,
      messageValid: false,
      formValid: false
    };
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value}, () => {this.validateField(name, value)});
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let subjectValid = this.state.subjectValid;
    let messageValid = this.state.messageValid;

  switch(fieldName) {
    case 'to_email':
      emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      fieldValidationErrors.to_email = emailValid ? '' : ' is invalid';
      break;
    case 'subject':
      subjectValid = value.match(/([^\s])/i);
      fieldValidationErrors.subject = subjectValid ? '' : ' is invalid';
      break;
    case 'message':
      messageValid = value.match(/([^\s])/i);
      fieldValidationErrors.message = messageValid ? '' : ' is invalid';
      break;
    default:
      break;
  }
  this.setState({formErrors: fieldValidationErrors,
                  emailValid: emailValid,subjectValid: subjectValid, messageValid: messageValid
                }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.subjectValid && this.state.messageValid});
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('form submitted');

    const data = {
      to: this.state.to_email,
      cc: this.state.cc_email,
      bcc: this.state.bcc_email,
      subject: this.state.subject,
      text: this.state.message
    };

    // dev
    const url = '/api/send-email';

    // prod
    // const url = 'https://mysterious-shore-61618.herokuapp.com/api/send-email';
    
    axios.post(url, data)
      .then(res => {  
        console.log(res);
        console.log(res.data);
      });
  }


  render() {
    return (

      <div>
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>
        <form className="emailForm">
          <h2>Contact Form</h2>
        <div className="form-group">
          <label htmlFor="to_email">To:</label>
          <input type="email" className="form-control" onChange={(e) => this.handleUserInput(e)}
            name="to_email" value={this.state.to_email} />
        </div>
        <div className="form-group">
          <label htmlFor="cc_email">CC: </label>
          <input type="email" className="form-control" onChange={(e) => this.handleUserInput(e)}
            name="cc_email" value={this.state.cc_email} />
        </div>
        <div className="form-group">
          <label htmlFor="bcc_email">BCC: </label>
          <input type="email" className="form-control" onChange={(e) => this.handleUserInput(e)}
            name="bcc_email" value={this.state.bcc_email}/>
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input type="text" className="form-control" onChange={(e) => this.handleUserInput(e)} 
            name="subject" value={this.state.subject} />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea rows="4" className="form-control" onChange={(e) => this.handleUserInput(e)}
            name="message" value={this.state.message} ></textarea>
        </div>      
        <button type="button" className="btn btn-primary" disabled={!this.state.formValid} onClick={this.handleSubmit.bind(this)}>
            Submit Message
        </button>
      </form>
      </div>
      
    );
  }
}

export default EmailForm;
