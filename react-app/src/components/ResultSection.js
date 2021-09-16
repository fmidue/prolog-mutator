import React from "react";
import ResultTable from "./ResultTable";
import LoadingSpinner from './LoadingSpinner';
import Button from 'react-bootstrap/Button';


class ResultSection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showSpinner:true,
            showTable:false,
        }
        this.handleMutButtonClick = this.handleMutButtonClick.bind(this)
    }

    handleMutButtonClick(){
        this.setState({
            showSpinner: !this.state.showSpinner,
            showTable:!this.state.showTable
        })
    }

    render(){
        return(
            <div>
                <Button as="input" type="submit" value="Start Mutation" className="my-3" onClick={this.handleMutButtonClick} />{''}
                {this.state.showSpinner && <LoadingSpinner/>}
                {this.state.showTable && <ResultTable/>}
            </div>
            
        )
    }
}

export default ResultSection;