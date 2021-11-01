/*
Number of Mutations in "Summarily Mode" will be = Number of Operators ^ Number of Positions.
Example: #Operator : (;) and (,) => 2
         #Positions : 3
         #Mutants produced = 2 ^ 3 = 8
*/

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

//Testing Section
//const text47 = 'solve(A,B,C,D,E,F,G,H,I) :- generate(A,B,C,D,E,F,G,H,I),test(A,B,C,D,E,F,G,H,I).\n' +
//'generate(A,B,C,D,E,F,G,H,I) :- permutation([0,1,2,3,4,5,6,7,8,9],[A,B,C,D,E,F,G,H,I,_]).\n' +
//'test(A,B,C,D,E,F,G,H,I) :- V1=(((((H*10000)+(D*1000))+(G*100))+(A*10))+(B*1)),V2=(((I*100)+(H*10))+(A*1)),Sum=(V1+V2),Sum=:=(((((C*10000)+(F*1000))+(F*100))+(F*10))+(E*1)).\n'

//const indexArr47 = [ 55, 247, 275, 287 ]

//const opArr47 = [";",";",";",","]

//console.log(replaceOpIndex(text47,indexArr47,opArr47))

//console.log(disjConjMut(textAndOpObj47,"summToDisj",0))
//console.log(disjConjMut(textAndOpObj47,"toDisj",10))

//console.log(generateRandomChar(16,[",",";"]))

module.exports={
    disjConjMut:disjConjMut,
}