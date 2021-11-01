const relationalOperators = ["\\=", "<", ">", "=", "=<", ">=", "=:=","=\\=", "\\==","=="]

const arithmeticalOperators = ["+","-","*","/"]

const disjConjOperators = [";" , ","]

const alph = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

function unparseVar(obj){
    if (!Array.isArray(obj.contents) && obj.contents.tag === "Wildcard"){
        return "_";
    } else if (obj.contents.tag === "VariableName" && Array.isArray(obj.contents.contents)){
        return obj.contents.contents[1]
    }else if(obj.contents[0] === "[]"){
        return ""
    }
}

function unparseList(listArr){
    let list = ""
    listArr.forEach((obj)=>{
        if (obj.contents.tag === "VariableName" && Array.isArray(obj.contents.contents) && !Array.isArray(obj.contents)){
            list += obj.contents.contents[1] + "|"
        }else if (obj.contents[0] === "." && Array.isArray(obj.contents[1])){
            list = list.slice(0,-1)
            list += ","
            let listVar = unparseList(obj.contents[1])
            list += listVar + " "
        }else if (obj.contents.tag === "Wildcard"){ //First variable is Wildcard
            list += "_|"
        }else if (obj.tag ==="Struct" && obj.contents[0] === "[]"){
            list += ""
        }else if (obj.tag ==="Struct" && Array.isArray(obj.contents[1])&& obj.contents[1].length === 0){
            list += obj.contents[0] + ","
        }
    })
    var returnList = list.slice(0,-1) ;
    return returnList
}

function getVariable(varArr){
    let variableText = "("
    varArr.forEach((obj) => {
        // Capture Predicate
        if (obj.tag === "Struct" && obj.contents[0].match(/[a-z]+/gi) && Array.isArray(obj.contents[1]) && obj.contents[1].length !== 0){
            variableText += obj.contents[0]
            let variableParsed = getVariable(obj.contents[1])
            variableText +=  variableParsed + ","
        // Capture Numbers    
        }else if (obj.tag === "Struct" && obj.contents[1].length === 0){
                variableText += obj.contents[0] + ","
        //Capture Variable Name
        }else if (obj.tag === "Var"){
            var varText = unparseVar(obj)
            variableText += varText + ","
        // Capture List
        }else if (obj.tag === "Struct" && obj.contents[0] === "." && Array.isArray(obj.contents[1])){
            let variableParsed = "[" + unparseList(obj.contents[1]) + "]"
            variableText += variableParsed + ","
        // Capture relational Expressions
        }else if (relationalOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
            let opParsed = parseOperator(obj.contents[1], obj.contents[0],false)
            variableText += opParsed + ","
        // Capture arithmetical Equations
        }else if (arithmeticalOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
            let opParsed = parseOperator(obj.contents[1],obj.contents[0],false)
            variableText += opParsed + ","
        }
    })
    //remove last comma and add closing bracket
    var returnText = variableText.slice(0,-1) + ')';
    return returnText
}

function parseLhs(lhs){
    let lhsText = ""
    if (lhs.tag === "Struct" && lhs.contents[0].match(/[a-z]+/gi) && Array.isArray(lhs.contents[1])){
        lhsText += lhs.contents[0]
        let variableParsed = getVariable(lhs.contents[1])
        lhsText += variableParsed
    }
    return lhsText;
}

function parseDisjConj(objArr,operator,fromdisjconj){
    let returnText = ""
    let textDisj = ""
    objArr.forEach((obj)=>{
        if (obj.tag === "Struct" && obj.contents[0].match(/[a-z]+/gi)&& Array.isArray(obj.contents[1])){
            textDisj += obj.contents[0]
            let variableParsed = getVariable(obj.contents[1])
            textDisj += variableParsed + "~" + operator + "~"
        } else if (disjConjOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
            let opParsed = parseDisjConj(obj.contents[1],obj.contents[0],true)
            textDisj += opParsed + "~" + operator + "~"
        } else if (relationalOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
            let opParsed = parseOperator(obj.contents[1], obj.contents[0],true)
            textDisj += opParsed + "~" + operator + "~"
        } else if (obj.tag === "Var"){
            var varText = unparseVar(obj)
            textDisj += varText + "~" + operator + "~"
        } else if (arithmeticalOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
            let opParsed = parseOperator(obj.contents[1],obj.contents[0],true)
            textDisj += opParsed + "~" + operator + "~"
        }
    })
    if (fromdisjconj){
        textDisj = textDisj.slice(0,-3) 
        returnText = "(" + textDisj + ")"
    }else{
        returnText = textDisj.slice(0,-3)
    }
    return returnText
}

function parseOperator(objArr,operator,fromstructure){
    let returnText = ""
    let opText = ""
    objArr.forEach((obj)=>{
        if (obj.tag === "Var"){
            var varText = unparseVar(obj)
            opText += varText + "~" + operator + "~"
        }else if (obj.tag === "Struct" && obj.contents[1].length === 0){
            opText += obj.contents[0] + "~" + operator + "~"
        }else if (arithmeticalOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
            let opParsed = parseOperator(obj.contents[1],obj.contents[0],true)
            opText += opParsed + "~" +  operator + "~"
        }
    })
    const operatorLn = operator.length + 2
    if (fromstructure){
        opText = opText.slice(0,-operatorLn) 
        returnText = "(" + opText + ")"
    }else{
        returnText = opText.slice(0,-operatorLn)
    }
    return returnText
}

function parseRhs(rhs){
    let rhsText = ""
    if(Array.isArray(rhs) && rhs.length === 0){
        return null; // Return Fact
    } else{
        rhs.forEach((obj)=>{
            // Capture Predicate and its Parameter
            if (obj.tag === "Struct" && obj.contents[0].match(/[a-z]+/gi)&& Array.isArray(obj.contents[1])){
                rhsText += obj.contents[0]
                let variableParsed = getVariable(obj.contents[1])
                rhsText += variableParsed + "~,~"
            }
            // Capture Disjunctive or Conjunctive Equations 
            else if(disjConjOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
                let inStructure = false;
                let variableParsed = parseDisjConj(obj.contents[1], obj.contents[0],false)
                for (var i = 0; i < obj.contents[1].length ; i++){
                    // Capturing another Structure inside the Equation
                    if (obj.contents[1][i].tag ==="Struct"){
                        inStructure = true;
                        break
                    }
                }
                if (inStructure){
                    rhsText += "(" + variableParsed + ")~,~"
                }else{
                    rhsText += variableParsed + "~,~"
                }
            }else if (relationalOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
                let opParsed = parseOperator(obj.contents[1], obj.contents[0],false)
                rhsText += opParsed  + "~,~"
            }else if (arithmeticalOperators.includes(obj.contents[0]) && Array.isArray(obj.contents[1])){
                let opParsed = parseOperator(obj.contents[1],obj.contents[0],false)
                rhsText += opParsed  + "~,~"
            }
        })
        
    }
    rhsText = rhsText.slice(0,-3) + "."
    return rhsText
}

function findOperators(text){
    let returnValue = {}
    var regex = /(~(.*?)~)/g 
    var resultIndex
    var index = [];
    var charPos 
    while ((resultIndex = regex.exec(text))){
        index.push(resultIndex.index)
    }
    var resultChar = text.match(regex)
    var realIndex = realIndexNoEscapeChar(index)
    if(resultChar !== null){
        charPos = getCharacterPosition(realIndex,resultChar)
    } else{
        charPos = []
    }
    
    var realText = text.replace(/~/g,"")
    
    returnValue["realText"] = realText;
    returnValue["realIndex"] = realIndex;
    returnValue["charPos"] = charPos;
    return returnValue
}


function getCharacterPosition(index,char){
    let positionObject = {}
    let relOpPos = []
    let arOpPos = []
    let disjConjPos = []
    for(var i = 0; i < char.length; i++){
        var realChar = char[i].slice(1,-1)
        if (relationalOperators.includes(realChar)){
            relOpPos.push(index[i])
        }else if(arithmeticalOperators.includes(realChar)){
            arOpPos.push(index[i])
        }else if(disjConjOperators.includes(realChar)){
            disjConjPos.push(index[i])
        }
    }
    positionObject["relationalOperators"] = relOpPos
    positionObject["arithmeticalOperators"] = arOpPos
    positionObject["disjConjOperators"] = disjConjPos
    return positionObject;
}

function realIndexNoEscapeChar(index){
    let realIndex = []
    for (var i=0; i < index.length; i++){
        realIndex.push(index[i] - (i*2))
    }
    return realIndex
}

function capturePredicates(text){
    var textChar = text.split('');
    var bracket = 0;
    var startCapturing = false
    var predicate = "";
    var tempPredArr = [];
    var predIndex = [];
    var returnObj = {};
    var predicateArr = [];
    var startingIndex = 0;

    for (var i = 0; i< textChar.length; i++){
        if(startCapturing === false){
            if (alph.includes(textChar[i])){
                startCapturing = true;
                predicate += textChar[i]
            }
        }else if(startCapturing === true){
            if (bracket === 0){
                if (alph.includes(textChar[i].toLowerCase())){
                    predicate += textChar[i];
                    continue
                }
                else if (textChar[i]=== "("){
                    bracket++;
                    predicate += textChar[i];
                    continue
                }else{
                    startCapturing = false;
                    predicate = ""
                }
            }
            else if (bracket > 0){
                if (textChar[i]=== "("){
                    bracket++;
                    predicate+= textChar[i];
                    continue
                }
                else if(textChar[i]=== ")"){
                    bracket--;
                    predicate+= textChar[i];
                    if(bracket ===  0){
                        tempPredArr.push(predicate);
                        predicate = "";
                        startCapturing = false;
                    }
                    continue
                }
                else{
                    predicate += textChar[i];
                }
            }
        }
        
    }
    for (let i = 0; i < tempPredArr.length; i++){
        var frontIndex = text.indexOf(tempPredArr[i],startingIndex)
        if (frontIndex !== -1){
            predIndex.push([frontIndex, frontIndex + tempPredArr[i].length])
            predicateArr.push(tempPredArr[i])
            startingIndex = frontIndex + tempPredArr[i].length
        }
    }
    returnObj["predicates"] = predicateArr;
    returnObj["predIndex"] = predIndex;
    return returnObj;
}

function structParser(obj){
    let lineParsed = ""
    
    obj.forEach((line)=>{
        var lineLeftText = parseLhs(line.lhs)
        var lineRightText =parseRhs(line.rhs)
        lineParsed += lineLeftText
        // Determining Facts or Predicates 
        if(lineRightText == null){
            lineParsed += "."
        } else{
            lineParsed += " :- " + lineRightText
        }
        lineParsed += "\n"
    })
    var textAndOperators = findOperators(lineParsed)
    var predAndIndex = capturePredicates(textAndOperators.realText)
    textAndOperators["predicates"] = predAndIndex.predicates
    textAndOperators["predIndex"] = predAndIndex.predIndex
    return textAndOperators
}

module.exports={
    structParser:structParser,
}