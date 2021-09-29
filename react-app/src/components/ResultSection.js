import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ResultCard from "./ResultCard";


class ResultSection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            configLabel:"Upload your Config file here",
            solutionLabel:"Upload your Solution file here",
            configText:"",
            solutionText:"",
            configFile:{},
            solutionFile:{},
            responseLoaded:false,
            responseText:"",
            textEditorValue:"",
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
        this.handleTextEditorChange = this.handleTextEditorChange.bind(this)
    }

    handleUploadSolutionFile(e){
        if(e.target.files.length>0){
            this.setState({
                solutionLabel:e.target.files[0].name,
                solutionFile:e.target.files[0]
            })
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = (e) =>{this.setState({
                solutionText:e.target.result,
                textEditorValue:e.target.result
            })}
            reader.readAsText(file)
        }
    }

    handleUploadConfigFile(e){
        if(e.target.files.length>0){     
            this.setState({
                configLabel:e.target.files[0].name,
                configFile: e.target.files[0]
            })
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = (e) =>{this.setState({configText:e.target.result})}
            reader.readAsText(file)
        }
    }

    handleTextEditorChange(event) {
        this.setState({textEditorValue: event.target.value});
    }

    handleMutButtonClick(){
        this.setState({
            showSpinner: !this.state.showSpinner,
            showTable:!this.state.showTable
        })
        const data = new FormData()
        data.append('config', this.state.configFile)
        data.append('solution', this.state.solutionFile)
        fetch("http://localhost:8080/test-files", {
            method: "POST",
            body: data
        }).then(res => res.text())
        .then(data => this.setState({
            responseText: data,
            responseLoaded: true,
        }))
        .catch(e =>{console.log(e)})
        console.log(this.state)
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
                <Container className="medium-container">
                    <Form>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>This is your code:</Form.Label>
                            <Form.Control as="textarea" value={this.state.textEditorValue} rows={3} onChange={this.handleTextEditorChange}/>
                        </Form.Group>
                    </Form>
                </Container>
                {this.state.responseLoaded && 
                <ResultCard responseText={this.state.responseText}/>}
            </div>
            
        )
    }
}

export default ResultSection;