import React from 'react';
import { Authenticator } from 'aws-amplify-react';
import { BrowserRouter, Router, Route } from 'react-router';
import Home from './Home';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, withAuthenticator,  } from 'aws-amplify-react';

class App extends React.Component {
 constructor(props){
    super(props);
    console.log('first page');
}


 render(){
  return (
  <Authenticator>
    <Router history={BrowserRouter}>
        <Route path='/' component={App}>
            <Route exact path="/"  component={Home} />
        </Route>
    </Router>
  </Authenticator>
  );
 }
}

export default withAuthenticator(App,false, [
  <SignIn/>,
  <ConfirmSignIn/>,
  <ForgotPassword/>,
  <RequireNewPassword />
]);
