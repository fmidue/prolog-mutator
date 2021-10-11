/*
Number of Mutations in "Summarily Mode" will be = Number of Operators ^ Number of Positions.
Example: #Operator : (;) and (,) => 2
         #Positions : 3
         #Mutants produced = 2 ^ 3 = 8
*/

const replM = require("./ReplicateM")

function disjConjMut(textAndOpObj,mode,numMutant){
    var disjIndex = []
    var conjIndex = []
    var result = []

    //Separate Operators
    textAndOpObj.charPos.disjConjOperators.forEach((op)=>{
        if (textAndOpObj.realText.charAt(op) === ";"){
            disjIndex.push(op)
        }else{
            conjIndex.push(op)
        }
    })
    //Individually Mode
    if(mode === "toConj"){
        //Disjunction to Conjunction
        disjIndex.forEach(index=>{
            let mutantText = replaceOpIndex(textAndOpObj.realText,index,",")
            result.push(mutantText)
        })
        if (disjIndex.length < numMutant){
            selectRandomResult(result,disjIndex.length)
        }else{
            selectRandomResult(result,numMutant)
        }
    } else if (mode === "toDisj"){
        //Conjunction to Disjunction
        conjIndex.forEach(index=>{
            let mutantText = replaceOpIndex(textAndOpObj.realText,index,";")
            result.push(mutantText)
        })
        if (conjIndex.length < numMutant){
            selectRandomResult(result,conjIndex.length)
        }else{
            selectRandomResult(result,numMutant)
        }
    } 

    //Summarily Mode
    else if (mode === "summToConj"){
        let numOp = disjIndex.length
        let opArr = replM.replicateM(numOp,[",",";"]) 
        opArr.forEach((x)=>{
            for (var i = 0; i < numOp; i++){
                var mutantText = replaceOpIndex(textAndOpObj.realText,disjIndex[i],x[i])
            }
            result.push(mutantText)
        })
    }
    else if (mode === "summToDisj"){
        let numOp = conjIndex.length
        let opArr = replM.replicateM(numOp,[",",";"]) 
        opArr.forEach((x)=>{
            for (var i = 0; i < numOp; i++){
                var mutantText = replaceOpIndex(textAndOpObj.realText,conjIndex[i],x[i])
            }
            result.push(mutantText)
        })
    }
    console.log(result)
    console.log(result.length)
    return result;
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
function replaceOpIndex(text,index,newOp) {
    if(index > text.length-1){
        return text;
    } else{
        return text.substring(0,index) + newOp + text.substring(index+1);
    }
}

const textAndOpObj33 = {
    realText: 'a(X) :- male(X),child(X,juliet).\n' +
      'b(X) :- male(X),child(X,Z),child(Y,Z),female(Y).\n' +
      'c(X) :- child(Y,X),female(Y),child(Z,X),male(Z).\n' +
      'd(X) :- child(X,Y),male(Y),Y\\=harry.\n' +
      'mother(X,Y) :- female(X),child(Y,X).\n' +
      'brother(X,Y) :- male(X),child(X,Z),child(Y,Z),X\\=Y.\n' +
      'uncle(X,Y) :- brother(X,Z),child(Y,Z).\n' +
      'grandson(X,Y) :- male(X),child(X,Z),child(Z,Y).\n',
    realIndex: [
       15,  48,  59,  70, 100,
      110, 121, 149, 157, 159,
      192, 228, 239, 250, 252,
      283, 320, 331
    ],
    charPos: {
      relationalOperators: [ 159, 252 ],
      arithmeticalOperators: [],
      disjConjOperators: [
         15,  48,  59,  70, 100,
        110, 121, 149, 157, 192,
        228, 239, 250, 283, 320,
        331
      ]
    }
}

const textAndOpObj47 = {
    realText: 'solve(A,B,C,D,E,F,G,H,I) :- generate(A,B,C,D,E,F,G,H,I),test(A,B,C,D,E,F,G,H,I).\n' +
      'generate(A,B,C,D,E,F,G,H,I) :- permutation([0,1,2,3,4,5,6,7,8,9],[A,B,C,D,E,F,G,H,I,_]).\n' +
      'test(A,B,C,D,E,F,G,H,I) :- V1=(((((H*10000)+(D*1000))+(G*100))+(A*10))+(B*1)),V2=(((I*100)+(H*10))+(A*1)),Sum=(V1+V2),Sum=:=(((((C*10000)+(F*1000))+(F*100))+(F*10))+(E*1)).\n',
    realIndex: [
       55, 199, 206, 213, 216, 223, 226,
      232, 235, 240, 243, 247, 250, 255,
      260, 263, 268, 271, 275, 279, 283,
      287, 291, 300, 307, 310, 317, 320,
      326, 329, 334, 337
    ],
    charPos: {
      relationalOperators: [ 199, 250, 279, 291 ],
      arithmeticalOperators: [
        206, 213, 216, 223, 226,
        232, 235, 240, 243, 255,
        260, 263, 268, 271, 283,
        300, 307, 310, 317, 320,
        326, 329, 334, 337
      ],
      disjConjOperators: [ 55, 247, 275, 287 ]
    }
}

disjConjMut(textAndOpObj47,"summToDisj",0)


