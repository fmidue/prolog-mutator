import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

class LoadingSpinner extends React.Component{
    constructor(props){
        super(props);
        this.state={
            hidden:false
        };
    }

    render(){
        return(
            <div>
                {!this.state.hidden && <Spinner animation='border' variant='light'/>}
            </div>
        )
    }
}

export default LoadingSpinner;