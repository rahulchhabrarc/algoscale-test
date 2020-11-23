import React from 'react';
import Layout from '../components/layout'
import TextValidator from '../components/TextValidator'
import { ValidatorForm } from 'react-form-validator-core';
import LoadingOverlay from 'react-loading-overlay';
import Notifications, { notify } from 'react-notify-toast';
import ReCAPTCHA from "react-google-recaptcha";
import Router from 'next/router'

class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      loadingOverlay : false,
      isCaptchaVerified : false
    };

    this.show = notify.createShowQueue();
  }

  

  onChange = (value) => {
    this.setState({isCaptchaVerified : true});
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  submit = async (e) => {
    try {

        if(this.state.isCaptchaVerified == false)
        {
            this.show('Please verify that you are a human!','error', 5000);
            return
        }
        this.setState({loadingOverlay : true});

        var firstName = this.state.firstName;
        var lastName = this.state.lastName;
        var email = this.state.email;
        var message = this.state.message;

        // const url = process.env.DB_APIURL+'/api/add-message'

        const url = "http://localhost:4000/api/add-message";
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ firstName, lastName, email, message })
          }).then(function(response) {
              return response.json();
            });
            this.setState({loadingOverlay : false});
            if (response.success==true) {

              this.setState({firstName : '', lastName : '', email : '', message : ''})
              this.show(response.message,'success', 5000);
              Router.replace(`/analytics`);

            } else {
                this.show(response.message,'error', 5000);
            }
        }catch (error) {
            this.setState({loadingOverlay : false});
            this.show(error.message,'error', 5000);
        } 

  }



  render() {
    return (
        <LoadingOverlay
        active={this.state.loadingOverlay}
        spinner
        text='Processing...'>
        <Layout title="Contact Us">
            <Notifications options={{ zIndex: 300, top: '0px' }} />
            <div className="container">
                <div className="contactcontainer">
                    <h1>
                        Contact Us Form
                    </h1>
            <ValidatorForm
                ref="form" id="placeOrderform" debounceTime={4000} className="form" role="form" autoComplete="off"
                onSubmit={(e) => this.submit(e)}>

            <div className="form-group"><label htmlFor="inputAddress">First Name</label>
                <div className="form-group">
                <TextValidator
                    type="text"
                    name="firstName"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.firstName}
                    placeholder="First Name"
                    validators={['required']}
                    errorMessages={['First Name is required']}
                />
                </div>
            </div>

            <div className="form-group"><label htmlFor="inputAddress">Last Name</label>
                <div className="form-group">
                <TextValidator
                    type="text"
                    name="lastName"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.lastName}
                    placeholder="Last Name"
                    validators={['required']}
                    errorMessages={['Last Name is required']}
                />
                </div>
            </div>

            <div className="form-group"><label htmlFor="inputAddress">Email</label>
                <div className="form-group">
                <TextValidator
                    type="text"
                    name="email"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.email}
                    placeholder="Email"
                    validators={['required', 'isEmail']}
                    errorMessages={['Email is required', 'Email is not valid']}
                />
                </div>
            </div>

            <div className="form-group"><label htmlFor="inputAddress">Message</label>
                <div className="form-group">
                    <textarea onChange={this.handleChange} className="form-control" name="message" value={this.state.message} placeholder="Message" className="form-control" id="" rows="3"></textarea>
                </div>
            </div>

            <ReCAPTCHA
                sitekey="6Lem8ugZAAAAAM6v7Um80DDG03IlNU1bZoVCLzKc"
                render="explicit"
                onChange={this.onChange}
            />

            <button className="submit-button">Submit</button>

            </ValidatorForm>
            </div>
            </div>

        </Layout>
      </LoadingOverlay>
    );
  }
}

export default ContactUs;