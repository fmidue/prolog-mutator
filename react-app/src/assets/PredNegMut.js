const replM = require("./ReplicateM")
const helper = require("./HelperFunctions")

function predNegMut(textAndOpObj,mode,num){
    var result = [];
    if (mode==="indiv"){
        let mutantArr = performIndividualMutations(textAndOpObj.realText,textAndOpObj.predIndex, textAndOpObj.predicates,num)
        result = result.concat(mutantArr)
    }else if (mode==="summ"){
        let mutantArr = performSummarilyMutations(textAndOpObj.realText,textAndOpObj.predIndex,textAndOpObj.predicates,num)
        result = result.concat(mutantArr)
    }
    return result;
}

function performIndividualMutations(text,indexArr,predicates,numMutant){
    let mutantArray = []
    indexArr.forEach((indexPair,i)=>{
        let negationExist = false
        if(predicates[i].includes("\\+")){
            negationExist = true
        }
        let mutantText = negateSinglePredicate(text,[indexPair],[negationExist])
        mutantArray.push(mutantText);
    })
    
    if (indexArr.length < numMutant){
        mutantArray = helper.selectRandomResult(mutantArray,indexArr.length);
    }else{
        mutantArray = helper.selectRandomResult(mutantArray,numMutant);
    }
    return mutantArray;
}

function performSummarilyMutations(text,indexArr,predicates,numMutant){
    let mutantArray = []
    let numPred = indexArr.length
    //Check for Mutant Amount. Max 1000
    if (numPred !== 0){
        if (Math.pow(2,numPred) < numMutant){
            let variationArr = replM.replicateM(numPred,[0,1],true) 
            variationArr.forEach((x)=>{
                var mutIndexArr = []
                let negArray = []
                for (var i = 0; i < numPred; i++){
                    if (x[i]===1||!Array.isArray(x)){
                        mutIndexArr.push(indexArr[i])
                        predicates[i].includes("\\+") ? negArray.push(true) : negArray.push(false)
                    }
                }
                if(mutIndexArr.length > 0){
                    var mutantText = negateSinglePredicate(text,mutIndexArr,negArray)
                    mutantArray.push(mutantText)
                }
            })
        }else{
            while (mutantArray.length < numMutant){
                let variationArr = helper.generateRandomChar(numPred,[0,1])
                var mutIndexArr = []
                let negArray = []
                for (var i =0; i < variationArr.length; i++){
                    if(variationArr[i]===1){
                        mutIndexArr.push(indexArr[i])
                        predicates[i].includes("\\+") ? negArray.push(true) : negArray.push(false)
                    }
                }
                if(mutIndexArr.length>0){
                    let mutantText = negateSinglePredicate(text,mutIndexArr,negArray) 
                    if(!mutantArray.includes(mutantText)){
                        mutantArray.push(mutantText)
                    }
                }
            }
        }
    }
    return mutantArray;
}

function negateSinglePredicate(text,indexArr,negExist){
    if (indexArr[0][0] > text.length-1 ||indexArr.length === 0 ){
        return text;
    }else{
        if (indexArr.length === 1 && !negExist[0]){
            return text.substring(0,indexArr[0][0]) + " \\+ " + text.substring(indexArr[0][0],text.length)
        } else if (indexArr.length === 1 && negExist[0]){
            return text.substring(0,indexArr[0][0]) + text.substring(indexArr[0][0]+2,text.length)
        }
        let returnText = ""
        for(var i = 0; i < indexArr.length ; i++){
            if (i === 0){
                if(negExist[i]){
                    returnText += text.substring(0,indexArr[i][0]) + text.substring(indexArr[i][0]+2,indexArr[i+1][0])
                }else{
                    returnText += text.substring(0, indexArr[i][0]) + " \\+ " + text.substring(indexArr[i][0],indexArr[i+1][0])
                }
            }else if(i === indexArr.length-1){
                if(negExist[i]){
                    returnText += text.substring(indexArr[i][0]+2,text.length)
                }else{
                    returnText += " \\+ " + text.substring(indexArr[i][0],text.length) 
                }
            }else{
                if(negExist[i]){
                    returnText += text.substring(indexArr[i][0]+2,indexArr[i+1][0])
                }else{
                    returnText += " \\+ " + text.substring(indexArr[i][0],indexArr[i+1][0]) 
                }
            }
        }
        return returnText;
    }
}

module.exports={
    predNegMut:predNegMut,
}