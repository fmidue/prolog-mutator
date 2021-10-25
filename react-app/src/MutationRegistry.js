const disjConjMut = require('./assets/DisjConjMut')
const relOpMut = require('./assets/RelOpMut')
const ariOpMut = require('./assets/AriOpMut')
const predNegMut = require('./assets/PredNegMut')

const mutationRegistry = {
    conjDisjMut:{
        name : "Conjunction to Disjunction",
        enable: true,
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"conjDisj")
        },
    },
    disjConjMut:{
        name  : "Disjunction to Conjunction",
        enable: true,
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"disjConj")
        },
    },
    relOpMut:{
        name : "Relational Operator Mutation",
        enable: true,
        mutation: function (obj,mode){
            return relOpMut.relOpMut(obj,mode)
        },
    },
    ariOpMut:{
        name : "Arithmetical Operator Mutation",
        enable: true,
        mutation: function (obj,mode){
            return ariOpMut.ariOpMut(obj,mode)
        },
    },
    predNegMut:{
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