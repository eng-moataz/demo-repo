import React from 'react';
import { Authenticator } from 'aws-amplify-react';
import { BrowserRouter as Router, Route } from "react-router-dom";
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
    <Router>
      <div>
        <Route exact path='/' component={Home}/>
      </div>
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
