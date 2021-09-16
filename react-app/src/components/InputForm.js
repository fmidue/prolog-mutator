import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import React from 'react';

class InputForm extends React.Component{
    constructor(props){
        super(props)
    };
    
    render(){
        return(
            <Container className = "medium-container">
                <Row className="justify-content-center">
                <Form>
                    <Form.File.Label>Please upload your Prolog Code here</Form.File.Label>
                    <Form.File 
                        id="custom-file"
                        label="Upload file here"
                        custom
                    />
                </Form>
                </Row>
            </Container>
        )
    }
}

export default InputForm;
    
