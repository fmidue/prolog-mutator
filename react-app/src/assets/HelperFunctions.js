function replaceOpIndex(text,indexArr,newOpArr) {
    if(indexArr[0] > text.length-1){
        return text;
    } else{
        if(indexArr.length === 1){
            return text.substring(0,indexArr[0]) + newOpArr[0] + text.substring(indexArr[0]+1);
        }
        let returnText = ""
        for(var i = 0; i < indexArr.length ; i++){
            if (i === 0){
                returnText += text.substring(0, indexArr[i]) + newOpArr[i]
            }else if(i === indexArr.length-1){
                returnText += text.substring(indexArr[i-1]+1,indexArr[i]) + newOpArr[i]
                returnText += text.substring(indexArr[i]+1,text.length)
            }else{
                returnText += text.substring(indexArr[i-1]+1,indexArr[i]) + newOpArr[i]
            }
        }
        return returnText;
    }
}

function selectRandomResult(resArr,numMutant){
    if (resArr.length === numMutant){
        return resArr
    }else{
        var result = resArr
        var diff = resArr.length - numMutant
        for (var i = 0; i < diff; i++){
            var elemIndex = Math.floor(Math.random() * (resArr.length-i))
            result.splice(elemIndex,1)
        }
        return result
    }
}

function generateRandomChar(size,charArr){
    let returnArray = []
    for (var i = 0; i < size ; i++){
        let char = charArr[Math.floor(Math.random()*charArr.length)]
        returnArray.push(char)
    }
    return returnArray;
}

module.exports={
    replaceOpIndex:replaceOpIndex,
    selectRandomResult:selectRandomResult,
    generateRandomChar:generateRandomChar,
}