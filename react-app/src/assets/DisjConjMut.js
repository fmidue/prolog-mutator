/*
Number of Mutations will be = Number of Operators ^ Number of Positions.
Example: #Operator : (;) and (,) => 2
         #Positions : 3
         #Mutants produced = 2 * 3 = 8
*/

const replM = require("./ReplicateM")


function disjConjMut(text){
    var result = []
    var pos = []
    let disjStr = ");"
    let conjStr = "),"
    //let textArray = text.split("\n")
    //let sepObj = separatePredicate(textArray)
    pos = pos.concat(getIndicesOf(conjStr,text).concat(getIndicesOf(disjStr,text))).sort()
    pos.push(text.length)
    var numOp = pos.length
    var opArr = replM.replicateM(numOp,[",",";"]) 
    
    for(var i= 0; i < opArr.length; i++){
        var tempCode = ""
        for (var j=0; j < numOp;j++){
            
            var subCode 
            if(j==0){
                subCode = text.substring(0,pos[j]+1)
                tempCode = tempCode.concat(subCode)
            }else{
                subCode = text.substring(pos[j-1]+2,pos[j]+1)
                tempCode = tempCode.concat(subCode)
            }
            if(j!=numOp-1){
                tempCode = tempCode.concat(opArr[i][j])
            }
        }
        result.push(tempCode)
    }
    console.log(result)
}


function separatePredicate(textArr){
    var factArr = []
    var predArr = []
    for(var i=0; i<textArr.length; i++){
        if(textArr[i].includes(":-")){
            predArr.push(textArr[i])
        }else{
            factArr.push(textArr[i])
        }
    }
    var textObj = {}
    textObj["facts"] = factArr
    textObj["predicates"] = predArr
    return textObj
}

function getIndicesOf(substr, code) {
    var subStrLn = substr.length;
    if (subStrLn == 0) {
        return [];
    }
    var startIndex = 0 
    var index 
    var pos = [];
    while ((index = code.indexOf(substr, startIndex)) > -1) {
        pos.push(index);
        startIndex = index + subStrLn;
    }
    return pos;
}

const solution = "f([],Ys,Ys).\nf([X|Xs],Ys,[X|Zs]) :- f(Ys,Xs,Zs)."

const solution2 = `a(X) :- male(X), child(X,juliet).
b(X) :- male(X), child(X,Z), child(Y,Z), female(Y).
c(X) :- child(Y,X), female(Y), child(Z,X), male(Z).
d(X) :- child(X,Y), male(Y), Y\=harry.

mother(X,Y) :- child(Y,X).
brother(X,Y) :- male(X), child(X,Z), child(Y,Z), X\=Y.
uncle(X,Y) :- brother(X,Z), child(Y,Z).
grandson(X,Y) :- male(X), child(X,Z), child(Z,Y).
`

const solution3 = `h([],[]).
h([L|Ls],Us) :- reverse(L,R); h(Ls,Rs), append(R,Rs,Us).
` 
//getIndicesOf(").",solution)
disjConjMut(solution3)

