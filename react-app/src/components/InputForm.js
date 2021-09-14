import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import React from 'react';

export default function InputForm(){
    return(
        <Container className = "medium-container">
            <Row className="justify-content-center">
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Please upload your Prolog Code here.</Form.Label>
                <Form.Control type="file" className="form-control" />
            </Form.Group>
                <Button as="input" type="submit" value="Start Mutation" className="mb-3" />{''}
            </Row>
        </Container>
    )
}