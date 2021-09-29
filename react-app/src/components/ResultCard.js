import React from 'react';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';

class ResultCard extends React.Component{
    render(){
        return(
            <div>
                <Container className="small-container">
                    <Card>
                        <Card.Body>{this.props.responseText}</Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }

}

export default ResultCard;