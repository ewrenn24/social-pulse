import React, { Component } from 'react';
import axios from 'axios';

// component implements Facebook Login for the Web with the JavaScript SDK:
// https://developers.facebook.com/docs/facebook-login/web
export class FacebookLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };

    this.getLongTermToken = this.getLongTermToken.bind(this);
    this.statusChangeCallback = this.statusChangeCallback.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.checkLoginState = this.checkLoginState.bind(this);
  }

  componentDidMount() {
    /* eslint-disable */
    window.fbAsyncInit = function() {
      const appId = (process.env.NODE_ENV === 'production') ? '242627689545301' : '289287891496885';
      FB.init({
        appId,
        cookie     : true,   // enable cookies to allow the server to access the session
        xfbml      : true,   // parse social plugins on this page
        version    : 'v2.8', // use version 2.1
      });
    /* eslint-enable */

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      FB.getLoginStatus(function(response) { // eslint-disable-line
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);

    // Load the SDK asynchronously
    /* eslint-disable */
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    /* eslint-enable */
  }
  getLongTermToken() {
    axios.put('/api/v1/fbOauthCreate', { token: this.state.token });
  }

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.setState({ token: response.authResponse.accessToken });
      this.getLongTermToken();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState() {
    FB.getLoginStatus(function(response) { // eslint-disable-line
      this.statusChangeCallback(response);
    }.bind(this));
  }

  handleClick() {
    FB.login(this.checkLoginState(), { scope: 'publish_actions', return_scopes: true });  // eslint-disable-line
  }

  render() {
    return (
      <div>
        <br />
        <a href="#" onClick={this.handleClick}>Login to Facebook</a>
      </div>
    );
  }
}

export default FacebookLogin;
