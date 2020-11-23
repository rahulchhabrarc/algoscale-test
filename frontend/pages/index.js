import React from 'react';
import Layout from '../components/layout'
import SocialLogin from 'react-social-login'
import SocialButton from './SocialButton'
import Router from 'next/router'
import cookie from 'js-cookie'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }


  handleSocialLogin = (user) => {
    cookie.set('user_details', user._profile)
    Router.replace(`/contact-us`);
  }
   
  handleSocialLoginFailure = (err) => {
    console.error(err)
  }

  login = (e,type) => {
      console.log(type);
  }  

  render() {
    return (
      <Layout title="Login">
        <div className="container">
          <div className="logincontainer imgcontainer">
          <h2>Login</h2> 
            <SocialButton
            provider='google'
            appId='1023735634821-dmpp9286kg5tbj1o2ksgvgn74bsjhsqa.apps.googleusercontent.com'
            onLoginSuccess={(e) => this.handleSocialLogin(e)}
            onLoginFailure={(e) => this.handleSocialLoginFailure(e)}
          >
            Login with Google
          </SocialButton>
          <br/>
          
          {/* <SocialButton
            provider='facebook'
            appId='YOUR_APP_ID'
            onLoginSuccess={(e) => this.handleSocialLogin(e)}
            onLoginFailure={(e) => this.handleSocialLoginFailure(e)}
          >
            Login with Facebook
          </SocialButton> */}

          </div>
        </div>
          
      

      </Layout>
    );
  }
}

export default Login;