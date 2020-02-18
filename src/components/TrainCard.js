import React from 'react';

const TrainCard = (props) => {
    let train = props.train;
    let trainColor = train.lineColor.split(" ");
    trainColor = trainColor[0].toLowerCase();
    let cardHeaderClasses = trainColor + " stationCard";
    
    console.log(train);

    return (
        <div className="stationCardContainer">
            <a class={cardHeaderClasses}>
                <h1>{train.lineColor}</h1>
            </a>
            <div className="trainDirections">
                <div>
                    <h4>{train.titleA}</h4>
                    {train.trainsA.map((elem) =>
                        <h5>{elem.minutes} min</h5>
                    )}
                </div>
                <div>
                    <h4>{train.titleB}</h4>
                    {train.trainsB.map((elem) =>
                        <h5>{elem.minutes} min</h5>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TrainCard;