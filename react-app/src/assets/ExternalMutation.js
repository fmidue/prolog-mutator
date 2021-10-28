//var fs = require('fs');
var FormData = require('form-data');
const fetch = require('node-fetch');

async function externalMutation(textFile,mode,endPoint){
    var resArr
    const data = new FormData()
    const route = getModeAndNum(mode)
    data.append('program', textFile)
    await fetch(`http://localhost:8080/${endPoint}/${route}`,{
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(data => {resArr = data.result})
    .catch(e =>{console.log(e)})
    return resArr
}


function getModeAndNum(mode){
    var route = mode.mode
    if(mode.mode === "indiv"){
        route += "/" + mode.num.toString()
    }
    return route
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