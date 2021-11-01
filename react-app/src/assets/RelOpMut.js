//const relationalOperators = ["\\=", "<", ">", "=", "=<", ">=", "=:="]
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
function relOpMut(textAndOpObj,mode){
    var result = []
    //Individually Mode
    if (mode.mode === "indiv"){
        let mutantArr = performIndividualMutations(textAndOpObj.realText,textAndOpObj.charPos.relationalOperators,mode.num)
        result = result.concat(mutantArr)
    }else if(mode.mode === "summ"){
        let mutantArr = performSummarilyMutations(textAndOpObj.realText,textAndOpObj.charPos.relationalOperators)
        result = result.concat(mutantArr)
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

function performSummarilyMutations(text,indexArr){
    let mutantArray = []
    let numOp = indexArr.length
    //Check for Mutant Amount. Max 1000
    if (numOp !== 0){
        if (Math.pow(2,numOp) < 1000){
            let opArr = replM.replicateM(numOp,[0,1]) 
            opArr.forEach((x)=>{
                var mutantText = text
                var mutateIndex = []
                var newOpArr = []
                for (var i = 0; i < numOp ; i ++){
                    if (x[i]===1){
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
            while (mutantArray.length < 1000){
                let opElem = helper.generateRandomChar(numOp,[0,1])
                for(var i = 0; i < opElem.length ; i++){
                    var mutateIndex = []
                    var newOpArr = []
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

//const textAndOpObj33 = {
//    realText: 'a(X) :- male(X),child(X,juliet).\n' +
//      'b(X) :- male(X),child(X,Z),child(Y,Z),female(Y).\n' +
//      'c(X) :- child(Y,X),female(Y),child(Z,X),male(Z).\n' +
//      'd(X) :- child(X,Y),male(Y),Y\\=harry.\n' +
//      'mother(X,Y) :- female(X),child(Y,X).\n' +
//      'brother(X,Y) :- male(X),child(X,Z),child(Y,Z),X\\=Y.\n' +
//      'uncle(X,Y) :- brother(X,Z),child(Y,Z).\n' +
//      'grandson(X,Y) :- male(X),child(X,Z),child(Z,Y).\n',
//    realIndex: [
//       15,  48,  59,  70, 100,
//      110, 121, 149, 157, 159,
//      192, 228, 239, 250, 252,
//      283, 320, 331
//    ],
//    charPos: {
//      relationalOperators: [ 159, 252 ],
//      arithmeticalOperators: [],
//      disjConjOperators: [
//         15,  48,  59,  70, 100,
//        110, 121, 149, 157, 192,
//        228, 239, 250, 283, 320,
//        331
//      ]
//    }
//}

//const textAndOpObj47 = {
//    realText: 'solve(A,B,C,D,E,F,G,H,I) :- generate(A,B,C,D,E,F,G,H,I),test(A,B,C,D,E,F,G,H,I).\n' +
//      'generate(A,B,C,D,E,F,G,H,I) :- permutation([0,1,2,3,4,5,6,7,8,9],[A,B,C,D,E,F,G,H,I,_]).\n' +
//      'test(A,B,C,D,E,F,G,H,I) :- V1=(((((H*10000)+(D*1000))+(G*100))+(A*10))+(B*1)),V2=(((I*100)+(H*10))+(A*1)),Sum=(V1+V2),Sum=:=(((((C*10000)+(F*1000))+(F*100))+(F*10))+(E*1)).\n',
//    realIndex: [
//       55, 199, 206, 213, 216, 223, 226,
//      232, 235, 240, 243, 247, 250, 255,
//      260, 263, 268, 271, 275, 279, 283,
//      287, 291, 300, 307, 310, 317, 320,
//      326, 329, 334, 337
//    ],
//    charPos: {
//      relationalOperators: [ 199, 250, 279, 291 ],
//      arithmeticalOperators: [
//        206, 213, 216, 223, 226,
//        232, 235, 240, 243, 255,
//        260, 263, 268, 271, 283,
//        300, 307, 310, 317, 320,
//        326, 329, 334, 337
//      ],
//      disjConjOperators: [ 55, 247, 275, 287 ]
//    }
//}

//const text47 = textAndOpObj47.realText
//const index47 = textAndOpObj47.charPos.relationalOperators
//
//const text33 =`a(X) :- male(X),child(X,juliet).
//b(X) :- male(X),child(X,Z),child(Y,Z),female(Y).
//c(X) :- child(Y,X),female(Y),child(Z,X),male(Z).
//d(X) :- child(X,Y),male(Y),Y\\=harry.
//mother(X,Y) :- female(X),child(Y,X).
//brother(X,Y) :- male(X),child(X,Z),child(Y,Z),X\\=Y.
//uncle(X,Y) :- brother(X,Z),child(Y,Z).
//grandson(X,Y) :- male(X),child(X,Z),child(Z,Y).`
//
//const index33 = [ 159, 252 ]

//console.log(replM.replicateM(4,[0,1]))

//console.log(getCompleteOperator(text47,index47[3]))
//console.log(relOpMut(textAndOpObj47,"summ",5).length)
//console.log(generateRandomChar(4,[0,1]))

module.exports={
    relOpMut:relOpMut,
}