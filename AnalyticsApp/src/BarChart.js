import React from 'react';
import {Bar} from 'react-chartjs-2';
import _ from 'lodash';
import Loader from 'react-loader-spinner';
import { API } from 'aws-amplify';
import config from './config';


class BarChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      Loading: true,
      previousAPIData: null,
      currentstate: {}
  }
}
   
  componentWillMount() {
    this.getDataFromAPI();
    setInterval(() => {
      this.getDataFromAPI();
    }, 30000);
  }

    getDataFromAPI(){
       API.get(config.apiGateway.NAME, '/').then(response => {
       var labels1= [];
       var data1= [];
       var APIData={};
      for (const [key, value] of Object.entries(response)) {
               labels1.push(key);
               data1.push(value);
            }
            APIData.labels=labels1;
            APIData.data= data1;
        if (this.state.previousAPIData === null){
          this.setState({previousAPIData: APIData});
          this.updateChartData(response);
        }
        else if (_.isEqual(this.state.previousAPIData , APIData)) {
              console.log('same date');
        }
        else if(!_.isEqual(this.state.previousAPIData , APIData)){
          this.setState({previousAPIData: APIData});
          console.log('require update');
          this.updateChartData(response);
          }
         }).catch(error => {
        console.log(error.response)
        });
  }

  updateChartData(reply){
    this.setState(function(state, props) {
      var inlabels=[]
      var indata=[]
      for (const [key, value] of Object.entries(reply)) {
               inlabels.push(key);
               indata.push(value);
            }
      return {
        currentstate:
           {
            labels: inlabels ,
            datasets: [
              {
                label: 'Bar View',
                backgroundColor: 'rgba(75,200,163,0.2)',
                borderColor: 'rgba(75,200,163,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: indata
              }
             ]
           },
        Loading: false
       };
      });
    }

  render() {
    const loading = this.state.Loading;
    const height=200;
    const width=200;
    return (
      <div className="BarChart">
        <h2>Bar View of Top Pages Stream</h2>
        { loading ? <Loader className="LoaderClass" type="ThreeDots" color="#B8E9E8" height={height} width={width} /> : <Bar
          data={this.state.currentstate}
          options={{
            scales: {
             yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }, 
            maintainAspectRatio: true
          }}
        /> }
      </div>
    );
  }
}

export default BarChart;