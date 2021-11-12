//var fs = require('fs');
var FormData = require('form-data');
const fetch = require('node-fetch');

const addr = require('../AddressConst')
const serverAddress = addr.addressConst.hostServer

async function externalMutation(textFile,endPoint){
    var resArr
    const data = new FormData()
    data.append('program', textFile)
    await fetch(`${serverAddress}${endPoint}`,{
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(data => {resArr = data.result})
    .catch(e =>{console.log(e)})
    return resArr
}



//TESTING SCRIPT
//var testMode = {
//    mode: "indiv",
//    num: "5"
//}
//
//var file = fs.createReadStream("../../../unparsing-test/Task33unparsed.prolog")
//externalMutation(file,testMode,"drop-clause-mutation")

module.exports={
    externalMutation:externalMutation,
}