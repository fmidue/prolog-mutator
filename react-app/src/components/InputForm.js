import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import React from 'react';

export default function InputForm(){
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
            <Button as="input" type="submit" value="Start Mutation" className="my-3" />{''}
        </Container>
    )
}