import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import ResultCard from "./ResultCard";
import ResultTable from "./ResultTable";
import LoadingSpinner from "./LoadingSpinner";

const structParser = require('../assets/StructureParser')
const disjConjMut = require('../assets/DisjConjMut')
const relOpMut = require('../assets/RelOpMut')
const ariOpMut = require('../assets/AriOpMut')
const predNegMut = require('../assets/PredNegMut')

class ResultSection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            configLabel:"Upload your Config file here",
            configText:"",
            configFile:{},
            configEditorValue:"",

            solutionLabel:"Upload your Solution file here",
            solutionText:"",
            solutionFile:{},
            solutionStructure:[],
            solutionEditorValue:"",
            
            responseLoaded:false,
            responseText:"",

            mutantCode:[],

            conjDisjCheck:false,
            conjDisjMode:"toDisj",
            conjDisjNum: 0,

            disjConjCheck:false,
            disjConjMode:"toConj",
            disjConjNum:0,

            relOpMutCheck:false,
            relOpMutMode:"indiv",
            relOpMutNum: 0,

            ariOpMutCheck:false,
            ariOpMutMode:"indiv",
            ariOpMutNum: 0,

            predNegMutCheck:false,
            predNegMutMode:"indiv",
            predNegMutNum: 0,
            
            tableItems:[],
            tableReady:false,

            showTestingSpinner:false,
            showTableSpinner:false,
        }

        this.handleMutButtonClick = this.handleMutButtonClick.bind(this);
        this.handleUploadSolutionFile = this.handleUploadSolutionFile.bind(this);
        this.handleUploadConfigFile = this.handleUploadConfigFile.bind(this);
        this.handleTextEditorChange = this.handleTextEditorChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleMutationModeChange = this.handleMutationModeChange.bind(this);
        this.performMutationOnOptions = this.performMutationOnOptions.bind(this);
        this.handleTestSolutionClick = this.handleTestSolutionClick.bind(this);
        this.insertTableItems = this.insertTableItems.bind(this);
    }

    handleUploadSolutionFile(e){
        if(e.target.files.length>0){
            const data = new FormData()
            data.append('pl-source', e.target.files[0])
            fetch("http://localhost:8080/parse-file", {
            method: "POST",
            body: data
            }).then(res => res.json())
            .then(data => this.setState({
                solutionStructure: data
            }))
            .catch(e =>{console.log(e)})

            this.setState({
                solutionLabel:e.target.files[0].name,
                solutionFile:e.target.files[0]
            })
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = (e) =>{this.setState({
                solutionText:e.target.result,
                solutionEditorValue:e.target.result
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
            reader.onload = (e) =>{this.setState({
                configText:e.target.result,
                configEditorValue:e.target.result
            })}
            reader.readAsText(file)
        }
    }

    handleTextEditorChange(event) {
        if (event.target.id === "configEditorArea"){
            this.setState({configEditorValue: event.target.value});
        }else if(event.target.id === "solutionEditorArea"){
            this.setState({solutionEditorValue: event.target.value});
        }        
    }

    async handleMutButtonClick(){
        this.setState({
            tableItems:[],
            tableReady:false,
            showTableSpinner:true,
        })
        var solutionObj =  structParser.structParser(this.state.solutionStructure)
        var mutRes = this.performMutationOnOptions(solutionObj);
        console.log(Object.entries(mutRes))
        for (const [key, value] of Object.entries(mutRes)) {
            for (let i = 0; i < value.length; i++){
                console.log(`${key}${i}: ${value[i]}`);
                var blob = new Blob([value[i]], { type: 'text/plain' });
                var file = new File([blob], `${key}${i}.txt`, {type: "text/plain"});
                const data = new FormData()
                data.append('config', this.state.configFile)
                data.append('solution', file)
                await fetch("http://localhost:8080/test-files", {
                    method: "POST",
                    body: data
                
                }).then(res => res.text()).then(data => this.insertTableItems(`${key}${i}`,key,data,i))
            }
        }
        this.setState({
            tableReady:true,
            showTableSpinner:false,
        })
    }
    
    insertTableItems(fname,ftype,result,i){
        let fid = this.getItemID(ftype,i)
        console.log(fname)
        let resultArr = this.state.tableItems
        let resLn = result.split('\n')
        let res;
        if(resLn[0] ==="Success"){
            res = 0
        }else if (resLn[0]==="Failure"){
            res = 1
        }
        let resultObj = {
            id: fid,
            name:fname,
            type:ftype,
            result:res
        }
        resultArr.push(resultObj);
        this.setState({
            tableItems:resultArr,
        })
    }

    getItemID(ftype,i){
        var type = ftype
        var regex = /([A-Z])/g
        var resultChar, id = ""

        while ((resultChar = regex.exec(type))){
            id += resultChar[0];
        }
        id += `${i}`
        return id;
    }

    performMutationOnOptions(solutionObj){
        var mutantObj = {}
        if(this.state.disjConjCheck){
            let mutants = disjConjMut.disjConjMut(solutionObj,this.state.disjConjMode,this.state.disjConjNum);
            mutantObj["DisjunctionToConjunction"] = mutants;
        }
        if(this.state.conjDisjCheck){
            let mutants = disjConjMut.disjConjMut(solutionObj,this.state.conjDisjMode,this.state.conjDisjNum);
            mutantObj["ConjunctionToDisjunction"] = mutants;
        }
        if(this.state.relOpMutCheck){
            let mutants = relOpMut.relOpMut(solutionObj,this.state.relOpMutMode,this.state.relOpMutNum);
            mutantObj["RelationalOperatorMutation"] = mutants;
        }
        if(this.state.ariOpMutCheck){
            let mutants = ariOpMut.ariOpMut(solutionObj, this.state.ariOpMutMode, this.state.ariOpMutNum);
            mutantObj["ArithmeticalOperatorMutation"] = mutants;
        }
        if(this.state.predNegMutCheck){
            let mutants = predNegMut.predNegMut(solutionObj,this.state.predNegMutMode,this.state.predNegMutNum);
            mutantObj["PredicateNegationMutation"] = mutants;
        }
        return mutantObj;
    }

    handleCheckboxChange(event) {
        const target = event.target
        const checked = target.checked
        const name = target.name
        this.setState({
            [name]: checked,
        });
        console.log(this.state);
    }

    handleMutationModeChange(event){
        const target = event.target
        const name = target.name
        this.setState({
            [name]: event.target.value
        })
    }

    handleTestSolutionClick(event){
        this.setState({
            responseLoaded:false,
            tableItems: [],
            tableReady:false,
            showTestingSpinner:true,
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
            showTestingSpinner:false,
        }))
        .catch(e =>{console.log(e)})
    }

    render(){
        return( 
            <div>
                <div id = "fileUploader">
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
                </div>
                <Button as="input" type="submit" value="Test Current Solution" className="my-3" onClick={this.handleTestSolutionClick} />{''}
                {this.state.showTestingSpinner &&
                <LoadingSpinner/>}
                {this.state.responseLoaded && 
                <ResultCard responseText={this.state.responseText}/>}
                {this.state.responseLoaded && 
                <div id="codeEditor">                   
                    <Container fluid className="mt-5">
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Group controlId="configEditorArea">
                                        <Form.Label>This is your Configuration:</Form.Label>
                                        <Form.Control as="textarea" value={this.state.configEditorValue} onChange={this.handleTextEditorChange}/>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col>
                                <Form>
                                    <Form.Group controlId="solutionEditorArea">
                                        <Form.Label>This is your Solution Code:</Form.Label>
                                        <Form.Control as="textarea" value={this.state.solutionEditorValue} onChange={this.handleTextEditorChange}/>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </div>}
                {this.state.responseLoaded &&     
                <div id="disjConjSelect">           
                    <Container fluid className="my-3">
                        <Form.Row>
                            <Col>
                                <Form>
                                    <Form.Row>
                                        <Col >
                                        <div key="disjConjCheck" className="mb-3">
                                            <Form.Check
                                            name= "disjConjCheck"
                                            type= "checkbox"
                                            id= "disjConjCheck"
                                            onChange = {this.handleCheckboxChange}
                                            label="Disjunction to Conjunction Mutation"/>
                                        </div>
                                        </Col>
                                        <Col >
                                        <Form.Control name="disjConjMode" as="select" size="sm" value={this.state.disjConjMode} onChange={this.handleMutationModeChange}>
                                            <option value="toConj">Individually</option>
                                            <option value="summToConj">Summarily</option>
                                        </Form.Control>
                                        </Col>
                                        <Col >
                                        <Form.Control name="disjConjNum" type="text" size="sm" placeholder="# Mutants" onChange={this.handleMutationModeChange}/>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                            <Col>
                                <Form>
                                    <Form.Row>
                                        <Col >
                                        <div key="conjDisjCheck" className="mb-3">
                                            <Form.Check
                                            name="conjDisjCheck"
                                            type= "checkbox"
                                            id= "conjDisjCheck"
                                            onChange = {this.handleCheckboxChange}
                                            label="Conjunction to Disjunction Mutation"/>
                                        </div>
                                        </Col>
                                        <Col >
                                        <Form.Control name="conjDisjMode" as="select" size="sm" value={this.state.conjDisjMode} onChange={this.handleMutationModeChange}>
                                            <option value="toDisj">Individually</option>
                                            <option value="summToDisj">Summarily</option>
                                        </Form.Control>
                                        </Col>
                                        <Col>
                                        <Form.Control name="conjDisjNum" type="text" size="sm" placeholder="# Mutants" onChange={this.handleMutationModeChange}/>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                        </Form.Row>
                    </Container>
                </div>}
                {this.state.responseLoaded &&     
                <div id="relAriSelect">           
                    <Container fluid className="my-3">
                        <Form.Row>
                            <Col>
                                <Form>
                                    <Form.Row>
                                        <Col >
                                        <div key="relOpMutCheck" className="mb-3">
                                            <Form.Check
                                            name= "relOpMutCheck"
                                            type= "checkbox"
                                            id= "relOpMutCheck"
                                            onChange = {this.handleCheckboxChange}
                                            label="Relational Operator Mutation"/>
                                        </div>
                                        </Col>
                                        <Col >
                                        <Form.Control name="relOpMutMode" as="select" size="sm" value={this.state.relOpMutMode} onChange={this.handleMutationModeChange}>
                                            <option value="indiv">Individually</option>
                                            <option value="summ">Summarily</option>
                                        </Form.Control>
                                        </Col>
                                        <Col >
                                        <Form.Control name="relOpMutNum" type="text" size="sm" placeholder="# Mutants" onChange={this.handleMutationModeChange}/>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                            <Col>
                                <Form>
                                    <Form.Row>
                                        <Col >
                                        <div key="ariOpMutCheck" className="mb-3">
                                            <Form.Check
                                            name= "ariOpMutCheck"
                                            type= "checkbox"
                                            id= "ariOpMutCheck"
                                            onChange = {this.handleCheckboxChange}
                                            label="Arithmetical Operator Mutation"/>
                                        </div>
                                        </Col>
                                        <Col >
                                        <Form.Control name="ariOpMutMode" as="select" size="sm" value={this.state.ariOpMutMode} onChange={this.handleMutationModeChange}>
                                            <option value="indiv">Individually</option>
                                            <option value="summ">Summarily</option>
                                        </Form.Control>
                                        </Col>
                                        <Col >
                                        <Form.Control name="ariOpMutNum" type="text" size="sm" placeholder="# Mutants" onChange={this.handleMutationModeChange}/>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                        </Form.Row>
                    </Container>
                </div> }
                {this.state.responseLoaded &&     
                <div id="negSelect">           
                    <Container fluid className="my-3">
                        <Form.Row>
                            <Col>
                                <Form>
                                    <Form.Row>
                                        <Col >
                                        <div key="predNegMutCheck" className="mb-3">
                                            <Form.Check
                                            name= "predNegMutCheck"
                                            type= "checkbox"
                                            id= "predNegMutCheck"
                                            onChange = {this.handleCheckboxChange}
                                            label="Predicate Negation Mutation"/>
                                        </div>
                                        </Col>
                                        <Col >
                                        <Form.Control name="predNegMutMode" as="select" size="sm" value={this.state.predNegMutMode} onChange={this.handleMutationModeChange}>
                                            <option value="indiv">Individually</option>
                                            <option value="summ">Summarily</option>
                                        </Form.Control>
                                        </Col>
                                        <Col >
                                        <Form.Control name="predNegMutNum" type="text" size="sm" placeholder="# Mutants" onChange={this.handleMutationModeChange}/>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                        </Form.Row>
                    </Container>
                </div> }
                {this.state.responseLoaded && 
                <Button as="input" type="submit" value="Start Mutation" className="my-3" onClick={this.handleMutButtonClick} />}
                {this.state.showTableSpinner &&
                <LoadingSpinner/>}
                {this.state.tableReady &&
                <ResultTable items={this.state.tableItems}/>}
            </div>
            
        )
    }
}

export default ResultSection;