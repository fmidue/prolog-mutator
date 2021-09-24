import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import React from 'react';

class InputForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            configLabel:"Upload your Config file here",
            solutionLabel:"Upload your Solution file here"
        }
        
        this.handleUploadSolutionFile = this.handleUploadSolutionFile.bind(this)
        this.handleUploadConfigFile = this.handleUploadConfigFile.bind(this)
    };

    handleUploadSolutionFile(e){
        if(e.target.files.length>0){
            this.setState({
                solutionLabel:e.target.files[0].name
            })
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = (e) =>{console.log("file:",e.target.result)}
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
            reader.onload = (e) =>{console.log("file:",e.target.result)}
            reader.readAsText(file)
        }
    }
    
    render(){
        return(
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
        )
    }
}

export default InputForm;
    
