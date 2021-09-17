import React from 'react';
import Container from 'react-bootstrap/Container';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {selectFilter} from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

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
    }

    render(){
        return(
                <Container>
                    <BootstrapTable keyField = 'id' data={this.props.items} columns={columns} filter={filterFactory()} bootstrap4={true} pagination={paginationFactory(paginationOptions)}/> 
                </Container>   
        )
    }
}
export default ResultTable;