const replM = require("./ReplicateM")
const helper = require("./HelperFunctions")

const transformationMap = {
    "+" : "-",
    "-" : "+",
    "*" : "+",
    "/" : "-",
}

function ariOpMut(textAndOpObj,mode){
    var result = []
    if (mode.mode==="indiv"){
        let mutantArr = performIndividualMutations(textAndOpObj.realText,textAndOpObj.charPos.arithmeticalOperators,mode.num)
        result = result.concat(mutantArr)
    }else if (mode.mode==="summ"){
        let mutantArr = performSummarilyMutations(textAndOpObj.realText,textAndOpObj.charPos.arithmeticalOperators,mode.num)
        result = result.concat(mutantArr)
    }
    return result;
}
function performIndividualMutations(text,indexArr,numMutant){
    let mutantArray = []
    indexArr.forEach(index=>{
        let newOpChar = transformationMap[text.charAt(index)]
        let mutantText = helper.replaceOpIndex(text,[index],[newOpChar])
        mutantArray.push(mutantText);
    })
    if (indexArr.length < numMutant){
        mutantArray = helper.selectRandomResult(mutantArray,indexArr.length);
    }else{
        mutantArray = helper.selectRandomResult(mutantArray,numMutant);
    }
    return mutantArray;
}

function performSummarilyMutations(text,indexArr,numMutant){
    let mutantArray = []
    let numOp = indexArr.length
    //Check for Mutant Amount. Max 1000
    if (numOp !== 0){
        if (Math.pow(2,numOp) < numMutant){
            let opArr = replM.replicateM(numOp,[0,1],true) 
            opArr.forEach((x)=>{
                var mutantText = text
                for (var i = 0; i < numOp; i++){
                    if (x[i]===1){
                        let newOpChar = transformationMap[text.charAt(indexArr[i])]
                        mutantText = helper.replaceOpIndex(mutantText,[indexArr[i]],[newOpChar])
                    }
                }
                mutantArray.push(mutantText)
            })
        }else{
            while (mutantArray.length < numMutant){
                let opElem = helper.generateRandomChar(numOp,[0,1])
                var opCharArr = []
                var mutIndexArr = []
                for (var i =0; i < opElem.length; i++){
                    if(opElem[i]===1){
                        let newOpChar = transformationMap[text.charAt(indexArr[i])]
                        mutIndexArr.push(indexArr[i])
                        opCharArr.push(newOpChar)
                    }
                }
                let mutantText = helper.replaceOpIndex(text,mutIndexArr,opCharArr) 
                if(!mutantArray.includes(mutantText)){
                    mutantArray.push(mutantText)
                }
            }
        }
    }
    return mutantArray;
}

module.exports={
    ariOpMut:ariOpMut,
}