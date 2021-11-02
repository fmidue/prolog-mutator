const replM = require("./ReplicateM")
const helper = require("./HelperFunctions")

function predNegMut(textAndOpObj,mode){
    var result = [];
    if (mode.mode==="indiv"){
        let mutantArr = performIndividualMutations(textAndOpObj.realText,textAndOpObj.predIndex, mode.num)
        result = result.concat(mutantArr)
    }else if (mode.mode==="summ"){
        let mutantArr = performSummarilyMutations(textAndOpObj.realText,textAndOpObj.predIndex,mode.num)
        result = result.concat(mutantArr)
    }
    return result;
}

function performIndividualMutations(text,indexArr,numMutant){
    let mutantArray = []
    indexArr.forEach(index=>{
        let mutantText = negateSinglePredicate(text,[index])
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
    let numPred = indexArr.length
    //Check for Mutant Amount. Max 1000
    if (numPred !== 0){
        if (Math.pow(2,numPred) < numMutant){
            let variationArr = replM.replicateM(numPred,[0,1],true) 
            variationArr.forEach((x)=>{
                var mutIndexArr = []
                for (var i = 0; i < numPred; i++){
                    if (x[i]===1){
                        mutIndexArr.push(indexArr[i])
                    }
                }
                var mutantText = negateSinglePredicate(text,mutIndexArr)
                mutantArray.push(mutantText)
            })
        }else{
            while (mutantArray.length < numMutant){
                let variationArr = helper.generateRandomChar(numPred,[0,1])
                var mutIndexArr = []
                for (var i =0; i < variationArr.length; i++){
                    if(variationArr[i]===1){
                        mutIndexArr.push(indexArr[i])
                    }
                }
                let mutantText = negateSinglePredicate(text,mutIndexArr) 
                if(!mutantArray.includes(mutantText)){
                    mutantArray.push(mutantText)
                }
            }
        }
    }
    return mutantArray;
}

function negateSinglePredicate(text,indexArr){
    
    if (indexArr[0] > text.length-1 ||indexArr.length === 0 ){
        return text;
    }else{
        if (indexArr.length === 1){
            return text.substring(0,indexArr[0][0]) + " \\+ " + text.substring(indexArr[0][0],text.length)
        }
        let returnText = ""
        for(var i = 0; i < indexArr.length ; i++){
            if (i === 0){
                returnText += text.substring(0, indexArr[i][0]) + " \\+ "
            }else if(i === indexArr.length-1){
                returnText += text.substring(indexArr[i-1][0],indexArr[i][0]) + " \\+ "
                returnText += text.substring(indexArr[i][0],text.length)
            }else{
                returnText += text.substring(indexArr[i-1][0],indexArr[i][0]) + " \\+ "
            }
        }
        return returnText;
    }
}

module.exports={
    predNegMut:predNegMut,
}