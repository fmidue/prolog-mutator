const task35struct = [
    {
        "lhs": {
            "tag": "Struct",
            "contents": [
                "penultimate",
                [
                    {
                        "tag": "Struct",
                        "contents": [
                            ".",
                            [
                                {
                                    "tag": "Var",
                                    "contents": {
                                        "tag": "VariableName",
                                        "contents": [
                                            0,
                                            "X"
                                        ]
                                    }
                                },
                                {
                                    "tag": "Struct",
                                    "contents": [
                                        ".",
                                        [
                                            {
                                                "tag": "Var",
                                                "contents": {
                                                    "tag": "Wildcard",
                                                    "contents": null
                                                }
                                            },
                                            {
                                                "tag": "Struct",
                                                "contents": [
                                                    "[]",
                                                    []
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        "tag": "Var",
                        "contents": {
                            "tag": "VariableName",
                            "contents": [
                                0,
                                "X"
                            ]
                        }
                    }
                ]
            ]
        },
        "rhs": []
    },
    {
        "lhs": {
            "tag": "Struct",
            "contents": [
                "penultimate",
                [
                    {
                        "tag": "Struct",
                        "contents": [
                            ".",
                            [
                                {
                                    "tag": "Var",
                                    "contents": {
                                        "tag": "Wildcard",
                                        "contents": null
                                    }
                                },
                                {
                                    "tag": "Var",
                                    "contents": {
                                        "tag": "VariableName",
                                        "contents": [
                                            0,
                                            "Xs"
                                        ]
                                    }
                                }
                            ]
                        ]
                    },
                    {
                        "tag": "Var",
                        "contents": {
                            "tag": "VariableName",
                            "contents": [
                                0,
                                "X"
                            ]
                        }
                    }
                ]
            ]
        },
        "rhs": [
            {
                "tag": "Struct",
                "contents": [
                    "penultimate",
                    [
                        {
                            "tag": "Var",
                            "contents": {
                                "tag": "VariableName",
                                "contents": [
                                    0,
                                    "Xs"
                                ]
                            }
                        },
                        {
                            "tag": "Var",
                            "contents": {
                                "tag": "VariableName",
                                "contents": [
                                    0,
                                    "X"
                                ]
                            }
                        }
                    ]
                ]
            }
        ]
    }
]

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
        }
    })
    var returnList = list.slice(0,-1) ;
    return returnList
}

function getVariable(varArr){
    let variableText = "("
    varArr.forEach((obj) => {
        if (obj.tag === "Struct" && obj.contents[0].match(/[a-z]+/gi) && Array.isArray(obj.contents[1]) && obj.contents[1].length != 0){
            variableText += obj.contents[0]
            let variableParsed = getVariable(obj.contents[1])
            variableText +=  variableParsed + ","
        }else if (obj.tag === "Struct" && obj.contents[1].length == 0){
                variableText += obj.contents[0] + ","
        }else if (obj.tag === "Var"){
            var varText = unparseVar(obj)
            variableText += varText + ","
        }else if (obj.tag === "Struct" && obj.contents[0] === "." && Array.isArray(obj.contents[1])){
            let variableParsed = "[" + unparseList(obj.contents[1]) + "]"
            variableText += variableParsed + ","
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

function parseDisjunctor(objArr){
    let textDisj = ""
    objArr.forEach((obj)=>{
        if (obj.tag === "Struct" && obj.contents[0].match(/[a-z]+/gi)&& Array.isArray(obj.contents[1])){
            textDisj += obj.contents[0]
            let variableParsed = getVariable(obj.contents[1])
            textDisj += variableParsed + ";"
        } else if (obj.contents[0] === ";" && Array.isArray(obj.contents[1])){
            let opParsed = parseDisjunctor(obj.contents[1])
            textDisj += opParsed 
        } else if (obj.contents[0] === "\\=" && Array.isArray(obj.contents[1])){
            let opParsed = parseOperator(obj.contents[1], "\\=")
            textDisj += opParsed 
        } else if (obj.tag === "Var"){
            var varText = unparseVar(obj)
            textDisj += varText + ","
        }
    })
    return textDisj
}

function parseOperator(objArr,operator){
    let opText = ""
    objArr.forEach((obj)=>{
        if (obj.tag === "Var"){
            var varText = unparseVar(obj)
            opText += varText + operator
        //} else if (obj.tag === "Struct" && obj.contents[0].match(/[a-z]+/gi) && Array.isArray(obj.contents[1]) && obj.contents[1].length != 0){
        //    opText += obj.contents[0]
        //    let variableParsed = getVariable(obj.contents[1])
        //    opText +=  variableParsed + ","
        }else if (obj.tag === "Struct" && obj.contents[1].length == 0){
            opText += obj.contents[0] + operator
        }
    })
    const operatorLn = operator.length
    opText = opText.slice(0,-operatorLn)
    return opText
}

function parseRhs(rhs){
    //Return null if it is a fact
    let rhsText = ""
    if(Array.isArray(rhs) && rhs.length === 0){
        return null;
    } else{
        rhs.forEach((obj)=>{
            if (obj.tag === "Struct" && obj.contents[0].match(/[a-z]+/gi)&& Array.isArray(obj.contents[1])){
                rhsText += obj.contents[0]
                let variableParsed = getVariable(obj.contents[1])
                rhsText += variableParsed + ","
            }
            else if(obj.contents[0] === ";" && Array.isArray(obj.contents[1])){
                let variableParsed = parseDisjunctor(obj.contents[1])
                rhsText += variableParsed + ","
            }else if (obj.contents[0] === "\\=" && Array.isArray(obj.contents[1])){
                let opParsed = parseOperator(obj.contents[1], "\\=")
                rhsText += opParsed  + ","
            }
        })
        
    }
    rhsText = rhsText.slice(0,-1) + "."
    return rhsText
}

function structParser(obj){
    let lineParsed = ""
    
    obj.forEach((line)=>{
        var lineLeftText = parseLhs(line.lhs)
        var lineRightText =parseRhs(line.rhs)
        lineParsed += lineLeftText
        if(lineRightText == null){
            lineParsed += "."
        } else{
            lineParsed += " :- " + lineRightText
        }
        lineParsed += "\n"
    })
    console.log(lineParsed)
}

structParser(task35struct)