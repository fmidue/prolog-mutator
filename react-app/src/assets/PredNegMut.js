const replM = require("./ReplicateM")

function predNegMut(textAndOpObj,mode,numMutant){
    var result = [];
    if (mode==="indiv"){
        let mutantArr = performIndividualMutations(textAndOpObj.realText,textAndOpObj.predIndex, numMutant)
        result = result.concat(mutantArr)
    }else if (mode==="summ"){
        let mutantArr = performSummarilyMutations(textAndOpObj.realText,textAndOpObj.predIndex)
        result = result.concat(mutantArr)
    }
    return result;
}

function performIndividualMutations(text,indexArr,numMutant){
    let mutantArray = []
    indexArr.forEach(index=>{
        let mutantText = negateSinglePredicate(text,[index])
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
    let numPred = indexArr.length
    //Check for Mutant Amount. Max 1000
    if (numPred !== 0){
        if (Math.pow(2,numPred) < 1000){
            let variationArr = replM.replicateM(numPred,[0,1]) 
            variationArr.forEach((x)=>{
                var mutIndexArr = []
                for (var i = 0; i < numPred; i++){
                    if (x[i]===1){
                        mutIndexArr.push(indexArr[i])
                    }
                }
                var mutantText = negateSinglePredicate(text,mutIndexArr)
                mutantArray.push(mutantText)
            })
        }else{
            while (mutantArray.length < 1000){
                let variationArr = generateRandomChar(numPred,[0,1])
                var mutIndexArr = []
                for (var i =0; i < variationArr.length; i++){
                    if(variationArr[i]===1){
                        mutIndexArr.push(indexArr[i])
                    }
                }
                let mutantText = negateSinglePredicate(text,mutIndexArr) 
                if(!mutantArray.includes(mutantText)){
                    mutantArray.push(mutantText)
                }
            }
        }
    }
    return mutantArray;
}

function negateSinglePredicate(text,indexArr){
    
    if (indexArr[0] > text.length-1 ||indexArr.length === 0 ){
        return text;
    }else{
        if (indexArr.length === 1){
            return text.substring(0,indexArr[0][0]) + "\\+ " + text.substring(indexArr[0][0],text.length)
        }
        let returnText = ""
        for(var i = 0; i < indexArr.length ; i++){
            if (i === 0){
                returnText += text.substring(0, indexArr[i][0]) + "\\+ "
            }else if(i === indexArr.length-1){
                returnText += text.substring(indexArr[i-1][0],indexArr[i][0]) + "\\+ "
                returnText += text.substring(indexArr[i][0],text.length)
            }else{
                returnText += text.substring(indexArr[i-1][0],indexArr[i][0]) + "\\+ "
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
    },
    predicates: [
      'a(X)',            'male(X)',
      'child(X,juliet)', 'b(X)',
      'male(X)',         'child(X,Z)',
      'child(Y,Z)',      'female(Y)',
      'c(X)',            'child(Y,X)',
      'female(Y)',       'child(Z,X)',
      'male(Z)',         'd(X)',
      'child(X,Y)',      'male(Y)',
      'mother(X,Y)',     'female(X)',
      'child(Y,X)',      'brother(X,Y)',
      'male(X)',         'child(X,Z)',
      'child(Y,Z)',      'uncle(X,Y)',
      'brother(X,Z)',    'child(Y,Z)',
      'grandson(X,Y)',   'male(X)',
      'child(X,Z)',      'child(Z,Y)'
    ],
    predIndex: [
      [ 0, 4 ],     [ 8, 15 ],    [ 16, 31 ],
      [ 33, 37 ],   [ 41, 48 ],   [ 49, 59 ],
      [ 60, 70 ],   [ 71, 80 ],   [ 82, 86 ],
      [ 90, 100 ],  [ 101, 110 ], [ 111, 121 ],
      [ 122, 129 ], [ 131, 135 ], [ 139, 149 ],
      [ 150, 157 ], [ 168, 179 ], [ 183, 192 ],
      [ 193, 203 ], [ 205, 217 ], [ 221, 228 ],
      [ 229, 239 ], [ 240, 250 ], [ 257, 267 ],
      [ 271, 283 ], [ 284, 294 ], [ 296, 309 ],
      [ 313, 320 ], [ 321, 331 ], [ 332, 342 ]
    ]
}

const textAndOpObj40 = {
    realText: 'h([],[]).\nh([L|Ls],Us) :- reverse(L,R),h(Ls,Rs),append(R,Rs,Us).\n',
    realIndex: [ 38, 47 ],
    charPos: {
      relationalOperators: [],
      arithmeticalOperators: [],
      disjConjOperators: [ 38, 47 ]
    },
    predicates: [
      'h([],[])',
      'h([L|Ls],Us)',
      'reverse(L,R)',
      'h(Ls,Rs)',
      'append(R,Rs,Us)'
    ],
    predIndex: [ [ 0, 8 ], [ 10, 22 ], [ 26, 38 ], [ 39, 47 ], [ 48, 63 ] ]
  }

console.log(predNegMut(textAndOpObj40,"summ"))
