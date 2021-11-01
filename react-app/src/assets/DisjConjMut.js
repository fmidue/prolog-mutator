const replM = require("./ReplicateM")
const helper = require("./HelperFunctions")

function disjConjMut(textAndOpObj,opt,caller){
    var disjIndex = []
    var conjIndex = []
    var result = []
    
    //Separate Operators
    if(Array.isArray(textAndOpObj.charPos.disjConjOperators) && textAndOpObj.charPos.disjConjOperators.length !== 0){
        textAndOpObj.charPos.disjConjOperators.forEach((op)=>{
            if (textAndOpObj.realText.charAt(op) === ";"){
                disjIndex.push(op)
            }else{
                conjIndex.push(op)
            }
        })
    }else{return result}
    
    //Disjunction to Conjunction
    if (caller === "DisjConj"){
        if(opt.mode === "indiv"){
            let mutantArr = performIndividualMutations(textAndOpObj.realText,disjIndex,",",opt.num)
            result = result.concat(mutantArr)
        } else if (opt.mode === "summ"){
            let mutantArr = performSummarilyMutations(textAndOpObj.realText,disjIndex)
            result = result.concat(mutantArr)
        }
    }
    //Conjunction to Disjunction
    else if(caller === "ConjDisj"){
        if (opt.mode === "indiv"){
            let mutantArr = performIndividualMutations(textAndOpObj.realText,conjIndex,";",opt.num)
            result = result.concat(mutantArr)
        } 
        else if (opt.mode === "summ"){
            let mutantArr = performSummarilyMutations(textAndOpObj.realText,conjIndex)
            result = result.concat(mutantArr)
        }
    }
    return result;
}

function performIndividualMutations(text,indexArr,toChar,numMutant){
    let mutantArray = []
    indexArr.forEach(index=>{
        let mutantText = helper.replaceOpIndex(text,[index],[toChar])
        mutantArray.push(mutantText);
    })
    if (indexArr.length < numMutant){
        mutantArray = helper.selectRandomResult(mutantArray,indexArr.length);
    }else{
        mutantArray = helper.selectRandomResult(mutantArray,numMutant);
    }
    return mutantArray;
}

function performSummarilyMutations(text,indexArr){
    let mutantArray = []
    let numOp = indexArr.length
    //Check for Mutant Amount. Max 1000
    if (numOp !== 0){
        if (Math.pow(2,numOp) < 1000){
            let opArr = replM.replicateM(numOp,[",",";"]) 
            opArr.forEach((x)=>{
                var mutantText = text
                for (var i = 0; i < numOp; i++){
                    mutantText = helper.replaceOpIndex(mutantText,[indexArr[i]],[x[i]])
                }
                mutantArray.push(mutantText)
            })
        }else{
            while (mutantArray.length < 1000){
                let opElem = helper.generateRandomChar(numOp,[",",";"])
                let mutantText = helper.replaceOpIndex(text,indexArr,opElem) 
                if(!mutantArray.includes(mutantText)){
                    mutantArray.push(mutantText)
                }
            }
        }
    }
    return mutantArray;
}

module.exports={
    disjConjMut:disjConjMut,
}