import React, {Component} from 'react';
import './App.css';
const stations = require('./station-info.json');

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
        // https://routing.openstreetmap.de/routed-foot/route/v1/driving/-118.29304571428573,34.07306742857143;-118.2919583,34.0766342?overview=false&geometries=polyline&steps=true
      // From; To
        //long, lat
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
          if(currDist < nearestDist){
            nearestDist = currDist;
            nearestStation = stations[i];
          }
        }
        callback(nearestStation,lat,lon);      
      },
      (error) =>{
        console.log(error);
      });
  }
  handleChange(event){
    this.setState({stationNum: event.target.value,
      stationTitle: event.target[event.target.selectedIndex].text
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
          this.setState({walkingEstimate: time + ' min'});
        }
      );
    });
  }
  render(){
    return (
      <div className="App">
        <h1>Los Angeles Metro Rail Arrival Predications</h1>
        {/* <p>Use GPS to find nearest station or select below.</p> */}
        <form className="formContainer">
          <button onClick={this.handleClick}>Use GPS</button>
          <label>or</label>
          <div className="selectContainer">
            <label>Select Metro Station</label>
            <select value={this.state.stationNum} 
              onChange={this.handleChange}>
              <option value="80201">North Hollywood</option>
              <option value="80202">Universal / Studio City</option>
              <option value="80203">Hollywood / Highland</option>
              <option value="80204">Hollywood / Vine</option>
              <option value="80205">Hollywood / Western</option>
              <option value="80206">Vermont / Sunset</option>
              <option value="80207">Vermont / Santa Monica</option>
              <option value="80208">Vermont / Beverly</option>
              <option value="80209">Wilshire / Vermont</option>
              <option value="80210">Westlake / Macarthur Park</option>
              <option value="80211">7th Street / Metro Center</option>
              <option value="80212">Pershing Square</option>
              <option value="80213">Civic Center / Grand Park</option>
              <option value="80214">Union Station</option>
            </select>
          </div>
        </form>
        <h3>{this.state.stationTitle}</h3>
        <h4>{this.state.walkingEstimate}</h4>
      </div>
    );
  }
}

export default App;
