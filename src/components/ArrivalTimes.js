import React , {Component} from 'react';
import TrainCard from './TrainCard';
import {trainLines, trainDirections} from '../data/stationData';

// let Line = {
//     lineNum: "",
//     directionA: {
//         title: "",
//         trains: []
//     },
//     directionB: {
//         title: "",
//         trains: []
//     }
// };
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
            lineNums: [],
            lines: []
        }
    }
    createLineObject(data,lines){
        console.log(data);
        // console.log(lines);
        var newState = [];
        lines.forEach(lineNum => {
            var line = {};
            line.lineColor = trainLines[lineNum];
            line.lineNum = lineNum;
            line.trainsA = [];
            line.trainsB = [];
            line.titleA = '';
            line.titleB = '';
            console.log(line.lineNum);

            data.forEach(train => {
                if(train.route_id == lineNum)
                {
                    if(train.run_id.charAt(4) == 0)
                    {
                        if(line.titleA == '')
                            line.titleA = trainDirections[train.run_id];
                        line.trainsA.push(train);
                    }
                    if(train.run_id.charAt(4) == 1){
                        if(line.titleB == '')
                            line.titleB = trainDirections[train.run_id];
                        line.trainsB.push(train);
                    }
                }
            });
            newState.push(line);
            // add line to state
        });
        this.setState({lines: newState})
        console.log(this.state.lines);
    }
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
                // this.setState({lines: []});
                this.setState({lineNums: tmp,
                data: data.items});
                this.createLineObject(this.state.data,this.state.lineNums);
            });
    }
    render(){
        console.log(this.state.lines.length);
        return(
            <div className="arrivalTimes">
                {this.state.lines.map((train) =>
                    <TrainCard train={train} />
                )}
            </div>
        );
    }
}
export default ArrivalTimes;
