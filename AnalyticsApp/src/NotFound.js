import React from 'react';

class NotFound extends React.Component {
 constructor(props){
    super(props);
    console.log('first page');
}


 render(){
  return (
  	<div className="Container">
       <h1>Oops!</h1>
  	   <img className="Images" src="notfound.jpeg" />
  	</div>
  );
 }
}

export default NotFound;