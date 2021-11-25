const relationalOperators = ["\\=", "<", ">", "=", "=<", ">=", "=:=", "=\\=", "\\==","=="]

const atomicRelOp = ["\\","=","<",">",":"]

const replM = require("./ReplicateM")
const helper = require("./HelperFunctions")

const transformationMap = {
    "=":"\\=",
    "\\=":"=",
    "=:=":"=\\=",
    "=\\=":"=:=",
    "==":"\\==",
    "\\==":"==",
    ">":"=<",
    ">=":"<",
    "<":">=",
    "=<":">"
}
function relOpMut(textAndOpObj,mode,num){
    //Make sure there are relational Operators
    var relOpArr = []
    if (textAndOpObj.charPos.relationalOperators){
        relOpArr = textAndOpObj.charPos.relationalOperators
    }
    var result = []
    //Individually Mode
    if(relOpArr.length > 0){
        if (mode === "indiv"){
            let mutantArr = performIndividualMutations(textAndOpObj.realText,relOpArr,num)
            result = result.concat(mutantArr)
        }else if(mode === "summ"){
            let mutantArr = performSummarilyMutations(textAndOpObj.realText,relOpArr,num)
            result = result.concat(mutantArr)
        }
    }
    return result;
}

function performIndividualMutations(text,indexArr,numMutant){
    let mutantArray = []
    indexArr.forEach(index=>{
        let operatorChar = getCompleteOperator(text,index)
        let newOpChar = transformationMap[operatorChar]
        let opCharLn = operatorChar.length
        let indexPair = [index,index+opCharLn]
        let mutantText = replaceRelOp(text,[indexPair],[newOpChar])
        mutantArray.push(mutantText);
    })
    if (indexArr.length < numMutant){
        mutantArray = helper.selectRandomResult(mutantArray,indexArr.length);
    }else{
        mutantArray = helper.selectRandomResult(mutantArray,numMutant);
    }
    return mutantArray;
}

function getCompleteOperator(text,index){
    var operator = ""
    var tempIndex = index
    while (atomicRelOp.includes(text.charAt(tempIndex))){
         operator += text.charAt(tempIndex)
         tempIndex += 1
    }
    if (relationalOperators.includes(operator)){
        return operator;
    }else return "";
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
                var mutateIndex = []
                var newOpArr = []
                for (var i = 0; i < numOp ; i ++){
                    //In a case only 1 operator found, replicateM will only return [1]
                        if (x[i]===1||!Array.isArray(x)){
                            var operatorChar = getCompleteOperator(text,indexArr[i])
                            var newOpChar = transformationMap[operatorChar]
                            var opCharLn = operatorChar.length
                            var indexPair = [indexArr[i],indexArr[i]+opCharLn]
                            newOpArr.push(newOpChar)
                            mutateIndex.push(indexPair)
                        }
                }
                if(mutateIndex.length > 0){
                    mutantText = replaceRelOp(mutantText,mutateIndex,newOpArr)
                }
                mutantArray.push(mutantText)
            })
        }else{
            while (mutantArray.length < numMutant){
                let opElem = helper.generateRandomChar(numOp,[0,1])
                var mutateIndex = []
                var newOpArr = []
                for(var i = 0; i < opElem.length ; i++){
                    if (opElem[i]===1){
                        var operatorChar = getCompleteOperator(text,indexArr[i])
                        var newOpChar = transformationMap[operatorChar]
                        var opCharLn = operatorChar.length
                        var indexPair = [indexArr[i],indexArr[i]+opCharLn]
                        newOpArr.push(newOpChar)
                        mutateIndex.push(indexPair)
                    }
                }
                if(mutateIndex.length > 0){
                    var mutantText = replaceRelOp(text,mutateIndex,newOpArr) 
                }
                
                if(!mutantArray.includes(mutantText)){
                    mutantArray.push(mutantText)
                }
            }
        }
    }
    return mutantArray;
}

//Replace (text) at (index) with (newOp)
function replaceRelOp(text,indexArr,newOpArr) {
    if(indexArr[0][0] > text.length-1){
        return text;
    } else{
        if(indexArr.length === 1){
            return text.substring(0,indexArr[0][0]) + newOpArr[0] + text.substring(indexArr[0][1]);
        }
        let returnText = ""
        for(var i = 0; i < indexArr.length ; i++){
            if (i === 0){
                returnText += text.substring(0, indexArr[i][0]) + newOpArr[i]
            }else if(i === indexArr.length-1){
                returnText += text.substring(indexArr[i-1][1],indexArr[i][0]) + newOpArr[i]
                returnText += text.substring(indexArr[i][1],text.length)
            }else{
                returnText += text.substring(indexArr[i-1][1],indexArr[i][0]) + newOpArr[i]
            }
        }
        return returnText;
    }
}

module.exports={
    relOpMut:relOpMut,
}