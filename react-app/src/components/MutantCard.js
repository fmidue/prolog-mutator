import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';

class MutantCard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mutantCode : this.props.mutCode,
            testResult : this.props.testRes,
            configFile : this.props.configFile,
        }
        this.handleMutantCodeChange = this.handleMutantCodeChange.bind(this)
        this.handleTestMutant = this.handleTestMutant.bind(this)
    }

    updateConfigFile=(cfgFile) => {
        this.setState({
          configFile: cfgFile
        });
    }

    handleMutantCodeChange(e){
        this.setState({mutantCode: e.target.value});
    }

    async handleTestMutant(){
        var blob = new Blob([this.state.mutantCode], { type: 'text/plain' });
        var file = new File([blob], `solutionParsed.prolog`, {type: "text/plain"});
        const data = new FormData()
        data.append('config', this.state.configFile)
        data.append('solution', file)
        await fetch("http://localhost:8080/test-files", {
            method: "POST",
            body: data
        }).then(res => res.text())
        .then(returnData => this.setState({
            testResult:returnData
        }))
        .catch(e =>{console.log(e)})
    }


    render(){
        return(
        <div id="mutantDetailCard">
            <Container style={{color:"white"}}>
                <Row>
                    <Col sm={6}>
                        <Form>
                            <Form.Group controlId="">
                                <Form.Control as="textarea" value={this.state.mutantCode} style={{height:500}} onChange={this.handleMutantCodeChange} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="">
                            <Form.Control as="textarea" value={this.state.testResult} readOnly style={{height:500}} />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <Button as="input" type="submit" value="Re-Test Mutant" className="mb-3" onClick={this.handleTestMutant}/>
        </div>
        )
    }
}
export default MutantCard;