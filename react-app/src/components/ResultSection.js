import React from "react";
import ResultTable from "./ResultTable";
import LoadingSpinner from './LoadingSpinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


const httpReq = require("../assets/HttpReq")

class ResultSection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            configLabel:"Upload your Config file here",
            solutionLabel:"Upload your Solution file here",
            configText:"",
            solutionText:"",
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
        this.handleUploadSolutionFile = this.handleUploadSolutionFile.bind(this)
        this.handleUploadConfigFile = this.handleUploadConfigFile.bind(this)
    }

    handleUploadSolutionFile(e){
        if(e.target.files.length>0){
            this.setState({
                solutionLabel:e.target.files[0].name
            })
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = (e) =>{this.setState({solutionText:e.target.result})}
            reader.readAsText(file)
        }
    }

    handleUploadConfigFile(e){
        if(e.target.files.length>0){     
            this.setState({
                configLabel:e.target.files[0].name
            })
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = (e) =>{this.setState({configText:e.target.result})}
            reader.readAsText(file)
        }
    }

    handleMutButtonClick(){
        console.log(this.state)
        this.setState({
            showSpinner: !this.state.showSpinner,
            showTable:!this.state.showTable
        })
        //const data= httpReq.httpGet("http://localhost:5000/")
        //console.log("data",data)
    }

    render(){
        return( 
            <div>
                <Container className = "medium-container">
                <Row className="justify-content-center">
                <Form>
                    <Form.File.Label>Please upload your Prolog Config and Solution here</Form.File.Label>
                    <Form.File 
                        id="config-file"
                        label={this.state.configLabel}
                        onChange={(e) => 
                            this.handleUploadConfigFile(e)}
                        custom
                    />
                    <Form.File className="mt-3"
                        id="solution-file"
                        label={this.state.solutionLabel}
                        onChange={(e) => 
                            this.handleUploadSolutionFile(e)}
                        custom
                    />
                </Form>
                </Row>
                </Container>
                <Button as="input" type="submit" value="Start Mutation" className="my-3" onClick={this.handleMutButtonClick} />{''}
                {this.state.showSpinner && <LoadingSpinner/>}
                {this.state.showTable && <ResultTable items={this.state.items} />}
            </div>
            
        )
    }
}

export default ResultSection;