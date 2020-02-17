import React , {Component} from 'react';
import TrainCard from './TrainCard';
/* 
Train Codes
801 = Blue line - long beach
802 = Red line
803 = Green line
804 = Gold line
805 = Purple line
806 = E line - Santa Monica
Train Direction
south = 0_var0
north = 1_var0
e.g. 802_0_var0 = Redline south
*/

// Get train data and create TrainCard components
// 7th Street Metro -  Red/Purple (80211), Blue/Expo (80122)
// Union Station - Red/Purple (80214), Gold (80409)
// Willowbrook - Rosa Parks Station - Blue(80112), Green (80311)

class ArrivalTimes extends Component {
    constructor(){
        super();
        this.state = {
            data: null,
            lines: []
        }
    }
    // numOfLines(value,index,self){
    //     return self.indexOf(value) === index;
    // }
    componentDidMount(){
        this.fetchData();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.stationNum !== this.props.stationNum) {
          this.fetchData();
        }
      }

    fetchData(){
        var API_URL = `https://api.metro.net/agencies/lametro-rail/stops/${this.props.stationNum}/predictions/`;
        // console.log(API_URL);        
        fetch(API_URL)
            .then(response => response.json())
            .then((data) => {
                var curr = data.items[0].route_id;
                var tmp = [];
                tmp.push(curr);
                data.items.forEach((station)=>{
                    if(curr != station.route_id){
                        tmp.push(station.route_id);
                        curr = station.route_id;
                    }
                })
                this.setState({lines: tmp,
                data: data.items});
                console.log(this.state.lines);
                
            });
    }
    render(){

        // if(this.state.lines.length > 0){
        //     this.state.lines.forEach((train) => { 
        //         trains.push(<TrainCard data={this.state.data} line={train}/>);
        //         }
        //     )
        // }
        return(
            <div>
                <h1>{this.props.stationNum}</h1>
                {this.state.lines.map((train) =>
                    <TrainCard data={this.state.data} line={train} />
                )}
            </div>
        );
    }
}
export default ArrivalTimes;
