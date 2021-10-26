import React from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import Container from "react-bootstrap/Container";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import FormControl from 'react-bootstrap/FormControl'

class MutOptionBar extends React.Component{
    constructor(props){
        super(props)
        this.state={
            dropdownDisabled: true,
            checked:false,
            mutationMode:"Individually"
        }
        this.handleCheck = this.handleCheck.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
    }
    
    handleCheck() {
        this.setState({
            checked: !this.state.checked,
            dropdownDisabled: !this.state.dropdownDisabled
        });
    }
    handleDropdownChange(eKey,e){
        if(eKey =="individual"){
            this.setState({
                mutationMode:"Individually"
            })
        }else if(eKey=="summary"){
            this.setState({
                mutationMode:"Summarily"
            })
        }
    }

    render(){
        return(
            <div id="disjConjSelect">
                <Container className="medium-container">
                    <InputGroup >
                        <InputGroup.Prepend>
                            <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={this.handleCheck} defaultChecked={this.state.checked} />
                        </InputGroup.Prepend>
                        <FormControl placeholder="Disjunction to Conjunction Mutation" readOnly/>
                        <DropdownButton as={InputGroup.Append} variant="outline-secondary" title={this.state.disjConj} id="disjConj" disabled={this.state.dropdownDisabled} className="custom-dropdown" onSelect={(eKey,e) => 
                            this.handleDropdownChange(eKey,e)}
                        >
                        <Dropdown.Item eventKey="individual">Individually</Dropdown.Item>
                        <Dropdown.Item eventKey="summary">Summarily</Dropdown.Item>
                        </DropdownButton>
                    </InputGroup>
                </Container>
                </div>
        )
    }
}

export default MutOptionBar;