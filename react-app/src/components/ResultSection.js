import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import ResultCard from "./ResultCard";
import ResultTable from "./ResultTable";
import LoadingSpinner from "./LoadingSpinner";

const mutationReg = require('../MutationRegistry')
const structParser = require('../assets/StructureParser')

class ResultSection extends React.Component{
    constructor(props){
        super(props);

        const optionArr = []
        for (let i = 0; i < Object.entries(mutationReg.mutationRegistry).length; i++){
            if(Object.entries(mutationReg.mutationRegistry)[i][1].enable){
                optionArr.push({
                    mutId : Object.entries(mutationReg.mutationRegistry)[i][0],
                    name : Object.entries(mutationReg.mutationRegistry)[i][1].name,
                    checked : false,
                    mode: "indiv",
                    num : 0,
                })
            }
        }

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

            mutationOption:optionArr,

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
        this.resetMutOptionState = this.resetMutOptionState.bind(this);
        this.findMutationOptionIndex = this.findMutationOptionIndex.bind(this);
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
        var mutRes = await this.performMutationOnOptions(solutionObj);
        for (const [key, value] of Object.entries(mutRes)) {
            for (let i = 0; i < value.length; i++){
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

    async performMutationOnOptions(solutionObj){
        var mutantObj = {}
        for(let i = 0; i < Object.entries(mutationReg.mutationRegistry).length; i++){
            var mutOptIndex = this.findMutationOptionIndex(Object.entries(mutationReg.mutationRegistry)[i][0])
            var mutationOption = this.state.mutationOption[mutOptIndex] 
            let entry = Object.entries(mutationReg.mutationRegistry)[i][1]
            if(mutationOption.checked && entry.enable && !entry.external && typeof entry.mutation === 'function'){
                let mutationResult = Object.entries(mutationReg.mutationRegistry)[i][1].mutation.call(this,solutionObj,mutationOption)
                let mutationKey = Object.entries(mutationReg.mutationRegistry)[i][0]
                mutantObj[mutationKey] = mutationResult
            }else if (mutationOption.checked && entry.enable && entry.external && typeof entry.mutation === 'function'){
                let mutationResult = await Object.entries(mutationReg.mutationRegistry)[i][1].mutation.call(this,this.state.solutionFile,mutationOption)
                let mutationKey = Object.entries(mutationReg.mutationRegistry)[i][0]
                mutantObj[mutationKey] = mutationResult
                
            }
        }
        return mutantObj
    }

    handleCheckboxChange(event) {
        const target = event.target
        const checked = target.checked
        const name = target.name
        const id = target.id
        const mutOptIndex = this.findMutationOptionIndex(id)
        let mutationOption = [...this.state.mutationOption];
        let mutation = {
            ...mutationOption[mutOptIndex],
            [name] : checked
        }
        mutationOption[mutOptIndex] = mutation;
        this.setState({
            mutationOption
        })
    }

    handleMutationModeChange(event){
        const target = event.target
        const name = target.name
        const id = target.id
        const mutOptIndex = this.findMutationOptionIndex(id)
        let mutationOption = [...this.state.mutationOption];
        let mutation = {
            ...mutationOption[mutOptIndex],
            [name] : event.target.value
        }
        mutationOption[mutOptIndex] = mutation;
        this.setState({
            mutationOption
        })
    }

    findMutationOptionIndex(id){
        var returnIndex
        this.state.mutationOption.forEach((type,index)=>{
            if (type.mutId === id){
                returnIndex = index
            }
        })
        return returnIndex;
    }

    resetMutOptionState(){
        let mutationOption = [...this.state.mutationOption];
        for (let i = 0; i < mutationOption.length; i++){
            let option = {...mutationOption[i]};
            option.checked = false;
            option.mode = "indiv";
            option.num = 0;
            mutationOption[i] = option
        }
        this.setState({mutationOption})
    }

    handleTestSolutionClick(event){
        this.resetMutOptionState();
        this.setState({
            responseLoaded:false,
            tableItems: [],
            tableReady:false,
            showTestingSpinner:true,
        })
        var solutionObj =  structParser.structParser(this.state.solutionStructure)
        console.log(solutionObj)
        var blob = new Blob([solutionObj.realText], { type: 'text/plain' });
        var file = new File([blob], `solutionParsed.txt`, {type: "text/plain"});
        const data = new FormData()
        data.append('config', this.state.configFile)
        data.append('solution', file)
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

                {this.state.responseLoaded && this.state.mutationOption.map((mutation,index)=>(
                    <div key = {index} id = {mutation.mutId}>
                    <Container className = "medium-container">
                        <Form.Check
                            name= "checked"
                            type= "checkbox"
                            id= {mutation.mutId}
                            onChange = {this.handleCheckboxChange}
                            label={mutation.name}
                        />
                        <Form.Control name="mode" as="select" size="sm" id={mutation.mutId} value={mutation.mode} onChange={this.handleMutationModeChange}>
                            <option value="indiv">Individually</option>
                            <option value="summ">Summarily</option>
                        </Form.Control>
                        <Form.Control name="num" id={mutation.mutId} type="text" size="sm" placeholder="# Mutants" onChange={this.handleMutationModeChange}/>
                    </Container>
                    </div>
                ))}
                
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