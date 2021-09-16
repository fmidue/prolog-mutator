import React from 'react';
import Container from 'react-bootstrap/Container';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {selectFilter} from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const resultOptions ={
    0: 'OK',
    1: 'Fail'
}

const items =[
    {id:1, name:'File1', type:'A', result:'0'},
    {id:2, name:'File2', type:'A', result:'1'},
    {id:3, name:'File3', type:'B', result:'0'},
    {id:4, name:'File4', type:'C', result:'0'},
    {id:5, name:'File5', type:'B', result:'1'},
    {id:6, name:'File6', type:'A', result:'1'},
    {id:7, name:'File7', type:'B', result:'0'},
];

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
        sort: true,
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

    }
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
        super(props);
        this.state={
            show:true
        };
    }

    render(){
        return(
            <div>
                {this.state.show &&
                <Container>
                    <BootstrapTable keyField = 'id' data={items} columns={columns} filter={filterFactory()} bootstrap4={true} pagination={paginationFactory(paginationOptions)}/> 
                </Container>}
            </div>
            
        )
    }
}

export default ResultTable;