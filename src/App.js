import React, {Component} from 'react';
import './App.css';
import Select from 'react-select';
import {redLine,groupedOptions } from './data/stationData'
import ArrivalTimes from './components/ArrivalTimes.js';
const stations = require('./data/station-info.json');

class App extends Component {
  constructor(){
    super();
    this.state = {
      stationTitle: 'North Hollywood',
      stationNum: '80201',
      walkingEstimate: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  getWalkingEstimate(lat,lon,stationLat,stationLon,callback){
    var URL = 'https://graphhopper.com/api/1/route?vehicle=foot&locale=en-US&key=LijBPDQGfu7Iiq80w3HzwB4RUDJbMbhs6BU0dEnn&ch.disable=false&elevation=false&instructions=true&point='+lat+'%2C'+lon+'&point='+stationLat+'%2C'+stationLon
    // var URL = 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/'+lon+','+lat+';'+stationLon+','+stationLat+'?overview=false&geometries=polyline'
    console.log(URL);
    
    fetch(URL)
    .then((response) => {
      if(!response.ok){
        throw new Error (response.statusText);
      }
      return response.json();
    })
    .then((myJson) => {
      // callback(Math.ceil(myJson.routes[0].duration / 60));
      console.log((myJson.paths[0].time / 60000));
      
      callback(Math.ceil(myJson.paths[0].time / 60000)+3);
    })
    .catch((error) =>{
      console.log(error);
    });

  }
  distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }
  getNearestStation(callback){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var nearestDist = 99;
        var currDist = 0;
        var nearestStation = "";
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        for(var i=0; i<stations.length;i++){
          currDist = this.distance(lat,lon,stations[i].lat,stations[i].long,"K");
          console.log(currDist);
          if(currDist < nearestDist){
            nearestDist = currDist;
            nearestStation = stations[i];
            console.log("This: " + nearestStation);
            
          }
        }
        
        callback(nearestStation,lat,lon);      
      },
      (error) =>{
        console.log(error);
      });
  }
  handleChange(event){
    console.log(this.refs.stationList.select);
    // console.log(this.refs.stationList.select.getOptionValue());

    console.log(event);
    this.setState({stationNum: event.value,
      stationTitle: event.label,
      walkingEstimate: ''
    });
  }
  handleClick(event){
    event.preventDefault();
    console.log("We here");

    
    this.getNearestStation((nearestStation,lat,lon) => {
      console.log(lat);
      console.log(lon);
      
      var str = nearestStation.station;
      
      var idx =  nearestStation.station.lastIndexOf(" ");
      str = str.substring(0, idx);
      this.setState({stationNum: nearestStation.stopnum,
        stationTitle: str});
      this.getWalkingEstimate(lat,lon,
        nearestStation.lat,nearestStation.long,
        (time) =>{
          this.setState({walkingEstimate: time + ' min walk to station'});
        }
      );
      // TODO: Display correct station on dropdown when GPS is used
      this.refs.stationList.select.setValue(
        {value: nearestStation.stopnum, label: nearestStation.station}
      );
      // this.refs.stationList.setState({value: 
      //   {
      //     value: nearestStation.stopnum,
      //     label: nearestStation.station
      //   }
      // });
        // console.log(this.refs.stationList.select.getOptionValue);
      // this.refs.stationList.select.selectOption(
      //   {value: nearestStation.stopnum, label: nearestStation.station}
      // );
      console.log(this.refs.stationList.select);



    });
  }
  render(){
    return (
      <div className="App">
        <div className="underConstruction">
          <h6 style={{"font-size":"1.3rem"}}>🚧 App still under construction 🚧</h6>
          <h6 style={{"font-size":"1.3rem"}}>Message me <a target="_blank" href="https://www.gabriel-rangel.com/contact">here</a> with any concerns or questions.</h6>
        </div>
        <h1>Los Angeles Metro Rail</h1>
        <form className="formContainer">
          <button className="button-primary" onClick={this.handleClick}>Use GPS</button>
          <label>or</label>
          <div className="selectContainer">
            <label>Select Metro Station</label>
            <Select
              ref="stationList"
              defaultValue={redLine[0]}
              onChange={this.handleChange}
              options={groupedOptions}
              placeholder="Select Station"
              />
          </div>
        </form>
        <h3>{this.state.stationTitle} Departure Times</h3>
        <ArrivalTimes 
          ref="arrivalTimes" 
          stationNum={this.state.stationNum} 
          walkingEstimate={this.state.walkingEstimate} />
      </div>
    );
  }
}

export default App;
