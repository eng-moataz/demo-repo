import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './Home';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, withAuthenticator, Authenticator  } from 'aws-amplify-react';
import NotFound from './NotFound';
import './App.css';

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
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route component={NotFound}/>
      </Switch>
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
