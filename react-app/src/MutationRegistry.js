const disjConjMut = require('./assets/DisjConjMut')
const relOpMut = require('./assets/RelOpMut')
const ariOpMut = require('./assets/AriOpMut')
const predNegMut = require('./assets/PredNegMut')

const mutationRegistry = {
    ConjDisjMut:{
        name : "Conjunction to Disjunction",
        enable: true,
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"ConjDisj")
        },
    },
    DisjConjMut:{
        name  : "Disjunction to Conjunction",
        enable: true,
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"DisjConj")
        },
    },
    RelOpMut:{
        name : "Relational Operator Mutation",
        enable: true,
        mutation: function (obj,mode){
            return relOpMut.relOpMut(obj,mode)
        },
    },
    AriOpMut:{
        name : "Arithmetical Operator Mutation",
        enable: true,
        mutation: function (obj,mode){
            return ariOpMut.ariOpMut(obj,mode)
        },
    },
    PredNegMut:{
        name : "Predicate Negation Mutation",
        enable: true,
        mutation: function (obj,mode){
            return predNegMut.predNegMut(obj,mode)
        },
    },
}

module.exports = {
    mutationRegistry:mutationRegistry,
}