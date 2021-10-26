const replM = require("./ReplicateM")

const transformationMap = {
    "+" : "-",
    "-" : "+",
    "*" : "+",
    "/" : "-",
}

function ariOpMut(textAndOpObj,mode){
    for(let i = 0; i < mode.length; i++){
        if (mode[i].mutId === "AriOpMut"){
            var option = mode[i]
        }
    }
    var result = []
    if(option.checked){
        if (option.mode==="indiv"){
            let mutantArr = performIndividualMutations(textAndOpObj.realText,textAndOpObj.charPos.arithmeticalOperators,option.num)
            result = result.concat(mutantArr)
        }else if (option.mode==="summ"){
            let mutantArr = performSummarilyMutations(textAndOpObj.realText,textAndOpObj.charPos.arithmeticalOperators)
            result = result.concat(mutantArr)
        }
    }
    return result;
}
function performIndividualMutations(text,indexArr,numMutant){
    let mutantArray = []
    indexArr.forEach(index=>{
        let newOpChar = transformationMap[text.charAt(index)]
        let mutantText = replaceOpIndex(text,[index],[newOpChar])
        mutantArray.push(mutantText);
    })
    if (indexArr.length < numMutant){
        mutantArray = selectRandomResult(mutantArray,indexArr.length);
    }else{
        mutantArray = selectRandomResult(mutantArray,numMutant);
    }
    return mutantArray;
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
                for (var i = 0; i < numOp; i++){
                    if (x[i]===1){
                        let newOpChar = transformationMap[text.charAt(indexArr[i])]
                        mutantText = replaceOpIndex(mutantText,[indexArr[i]],[newOpChar])
                    }
                }
                mutantArray.push(mutantText)
            })
        }else{
            while (mutantArray.length < 1000){
                let opElem = generateRandomChar(numOp,[0,1])
                var opCharArr = []
                var mutIndexArr = []
                for (var i =0; i < opElem.length; i++){
                    if(opElem[i]===1){
                        let newOpChar = transformationMap[text.charAt(indexArr[i])]
                        mutIndexArr.push(indexArr[i])
                        opCharArr.push(newOpChar)
                    }
                }
                let mutantText = replaceOpIndex(text,mutIndexArr,opCharArr) 
                if(!mutantArray.includes(mutantText)){
                    mutantArray.push(mutantText)
                }
            }
        }
    }
    return mutantArray;
}
//Remove some elements to make No of Result === numMutant
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

//Replace (text) at (index) with (newOp)
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
function generateRandomChar(size,charArr){
    let returnArray = []
    for (var i = 0; i < size ; i++){
        let char = charArr[Math.floor(Math.random()*charArr.length)]
        returnArray.push(char)
    }
    return returnArray;
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

//console.log(ariOpMut(textAndOpObj47,"summ",100))
//console.log(ariOpMut(textAndOpObj47,"summ",100).length)

module.exports={
    ariOpMut:ariOpMut,
}