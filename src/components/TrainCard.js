import React, { Component } from 'react';
import { render } from '@testing-library/react';


class TrainCard extends Component{
    // const TrainCard = (props) => {
    constructor(){
        super();
        this.state = {
            display: {}
        }
    }
    componentDidMount(){
        // var num = this.props.train.lineNum;
        // console.log(this.props.numOfLines);
        
        // if(this.props.train.numOfLines == 1){
        //     this.setState({
        //         display: {
        //             ...this.state.display,
        //         [num]: !this.state.display[num]
        //     }}); 
        // }
    }
    displayContent(num){
        // console.log(num);
        // console.log(this.state.display[num]);
        
        this.setState({
            display: {
                ...this.state.display,
                [num]: !this.state.display[num]
            }
        });      
    }
    convertTime(time){
        var convertedTime = '';
        var minutes = Math.floor(time / 60);
        var seconds = time % 60;
        if(minutes == 0 && seconds <= 30)
            convertedTime = "Arriving";
        else
            convertedTime = "" + (minutes > 0 ? minutes : "0") + ":" + (seconds < 10 ? "0" : "") + seconds;
        return convertedTime;
    }
    render(){
        let train = this.props.train;        
        let trainColor = train.lineColor.split(" ");
        trainColor = trainColor[0].toLowerCase();
        let cardHeaderClasses = trainColor + " stationCard";
        return (
            <div className="stationCardContainer">
                <button
                    onClick={()=> this.displayContent(train.lineNum)}
                    className={cardHeaderClasses}>
                    <h1>{train.lineColor}</h1>
                </button>
                <div className={this.state.display[train.lineNum] ? "trainDirections open" : "trainDirections close"}>
                    <div>
                        <h4>{train.titleA}</h4>
                        {train.trainsA.map((elem) =>
                            <h5>{this.convertTime(elem.seconds)} min</h5>
                        )}
                    </div>
                    <div>
                        <h4>{train.titleB}</h4>
                        {train.trainsB.map((elem) =>
                            <h5>{this.convertTime(elem.seconds)} min</h5>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default TrainCard;