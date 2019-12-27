import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { API } from 'aws-amplify';
import config from './config';
import _ from 'lodash';
import Loader from 'react-loader-spinner';




class DoughnutChart extends React.Component {
  constructor(props){
    super(props);
    console.log('Chart Page');
    this.state={
      previousAPIData: null,
      currentstate: {},
      Loading: true,
      colorPerPage: {},
      hoverColorPage:{}
    };
  }
    componentWillMount() {
    this.getDataFromAPI();
    setInterval(() => {
      this.getDataFromAPI();
    }, 30000);
    }

getColor(key, object) {
  if (key in this.state[object]){
    return this.state[object][key];
  }
  else{
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  this.setState(function(state) {
   state[object][key]=color;
   return state;
    });
   return color;
  }

}

  getDataFromAPI(){
       API.get(config.apiGateway.NAME, '/').then(response => {
       var labels= [];
       var data= [];
       var APIData={};
      for (const [key, value] of Object.entries(response)) {
               labels.push(key);
               data.push(value);
            }
            APIData.labels=labels;
            APIData.data= data;
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
      var labels= [];
      var data= [];
      var backgroundColor= [];
      var hoverBackgroundColor=[];
      var state={};
      for (const [key, value] of Object.entries(reply)) {
               labels.push(key);
               if(key == '/'){
                 data.push(Math.round(value/10));
               }
               else{
               data.push(value);
               }
               backgroundColor.push(this.getColor(key,"colorPerPage"));
               hoverBackgroundColor.push(this.getColor(key,"hoverColorPage"));
            }
        state.labels=labels;
        state.datasets= [];
        state.datasets.push({data,backgroundColor,hoverBackgroundColor});
        this.setState({currentstate: state});
        this.setState({Loading: false});
    }

  render(){
    const loading = this.state.Loading;
    const height=200;
    const width=200;
    const Dheight=300;
    const Dwidth=300;
    return(
        <div className="DoghnutChart">
               <h2>Top Pages Stream</h2>
                { loading ? <Loader className="LoaderClass" type="ThreeDots" color="#B8E9E8" height={height} width={width} /> : <Doughnut 
                    
                   data={this.state.currentstate} 
                   options={{
                    elements: {
                    arc: {
                        borderWidth: 0
                      } 
                   },
                 }}
                /> }

        </div>    
      );
  }

}

export default DoughnutChart;