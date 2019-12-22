import React from 'react';
import { Authenticator } from 'aws-amplify-react';
import { Route, Switch, Router } from 'react-router-dom';
import Home from './Home';
import history from './history';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, withAuthenticator,  } from 'aws-amplify-react';

class App extends React.Component {
 constructor(props){
    super(props);
    console.log('first page');
}


 render(){
  return (
  <Authenticator>
      <Router history={history}>
        <div>
          <h1>hello from home v1</h1>
          <Switch>
              <Route exact path='/index.html' component={Home}/>
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
