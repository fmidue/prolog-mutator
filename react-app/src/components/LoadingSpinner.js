import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

class LoadingSpinner extends React.Component{
    
    render(){
        return(
            <div>
                <Spinner className="mb-3" animation='border' variant='light'/>
            </div>
        )
    }
}

export default LoadingSpinner;