import React from 'react';
import Container from 'react-bootstrap/Container';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {selectFilter} from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import MutantCard from './MutantCard';

const mutationReg = require('../MutationRegistry')
const typeOptions = {}

for (let i = 0; i < Object.entries(mutationReg.mutationRegistry).length; i++){
    if(Object.entries(mutationReg.mutationRegistry)[i][1].enable){
        let mutId = Object.entries(mutationReg.mutationRegistry)[i][0];
        let name = Object.entries(mutationReg.mutationRegistry)[i][1].name;
        typeOptions[mutId] = name;
    }
}

const resultOptions ={
    0: 'OK',
    1: 'Fail'
}

const columns =[
    {
        dataField: 'id',
        text: 'No.',
        hidden:true
    },
    {
        dataField: 'name',
        text: 'Mutant Name',
        style: {color: 'white'},
        headerStyle: {color: 'white', backgroundColor:'#424856'}
    },
    {
        dataField: 'type',
        text:'Mutation Type',
        formatter: cell => typeOptions[cell],
        filter: selectFilter({
            options: typeOptions
        }),
        style: {color: 'white'},
        headerStyle: {color: 'white', backgroundColor:'#424856'},
    },
    {
        dataField: 'result',
        text: 'Test Result',
        formatter: cell => resultOptions[cell],
        filter: selectFilter({
            options: resultOptions
        }),
        sort: true,
        style : {color: 'white'},
        headerStyle: {color: 'white', backgroundColor:'#424856'},

    },
];



const paginationOptions ={
    paginationSize: 5,
    pageStartIndex: 1,
    alwaysShowAllBtns: false,
    prePageText: '<',
    nextPageText: '>',
    nextPageTitle: 'Next',
    prePageTitle: 'Previous',
    showTotal: true,
}


class ResultTable extends React.Component{
    constructor(props){
        super(props)
        this.state={
            oriCode: this.props.oriCode,
            configFile: this.props.configFile,
            expanded : []
        }
        this.updateMutCard = React.createRef()
    }
    updateConfigFile=(cfgFile) => {
        this.setState({
          configFile: cfgFile
        });
        if(this.state.expanded.length > 0){
            this.updateMutCard.current.updateConfigFile(cfgFile)
        }
    }

    handleOnExpand = (row, isExpand, rowIndex, e) =>{
        if (isExpand){
            this.setState(()=>({
                expanded : [...this.state.expanded,row.id]
            }));
        }else{
            this.setState(()=>({
                expanded: this.state.expanded.filter(x=> x!== row.id)
            }));
        }
    }
    
    render(){
        const expandRow = {
            renderer:(row)=>(
                <MutantCard mutCode={row.mutCode} oriCode={this.state.oriCode} testRes={row.resText} configFile={this.state.configFile} ref={this.updateMutCard}/>
            ),
            expanded: this.state.expanded,
            onExpand: this.handleOnExpand
        }
        return(
                <Container className ="pb-5">
                    <BootstrapTable keyField = 'id' data={this.props.items} columns={columns} expandRow={expandRow} filter={filterFactory()} bootstrap4={true} pagination={paginationFactory(paginationOptions)}/> 
                </Container>   
        )
    }
}
export default ResultTable;