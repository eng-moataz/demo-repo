import React from 'react';
import DoughnutChart from './DoughnutChart';
import BarChart from './BarChart';


class Home extends React.Component {
constructor(props){
	super(props);
	console.log('Home Page');
}



render(){	return(
	<div className="Home">
	     <h1> Analytics Dashboard </h1>
         <DoughnutChart />
         <BarChart />
     </div>

	);
 }
}
export default Home;