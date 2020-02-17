import React from 'react';

const TrainCard = (props) => {
    console.log("TrainCard");
    console.log(props.data);
    // Extract all trains that are line props.line from props.data
    
    
    return (
        <h1>{props.line}</h1>
    )
}

export default TrainCard;