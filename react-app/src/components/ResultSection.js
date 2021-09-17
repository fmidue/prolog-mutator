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
            items: [
                {id:1, name:'File1', type:'A', result:'0'},
                {id:2, name:'File2', type:'A', result:'1'},
                {id:3, name:'File3', type:'B', result:'0'},
                {id:4, name:'File4', type:'C', result:'0'},
                {id:5, name:'File5', type:'B', result:'1'},
                {id:6, name:'File6', type:'A', result:'1'},
                {id:7, name:'File7', type:'B', result:'0'},
            ],
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
                {this.state.showTable && <ResultTable items={this.state.items} />}
            </div>
            
        )
    }
}

export default ResultSection;