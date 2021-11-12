const disjConjMut = require('./assets/DisjConjMut')
const relOpMut = require('./assets/RelOpMut')
const ariOpMut = require('./assets/AriOpMut')
const predNegMut = require('./assets/PredNegMut')
const externalMutation = require('./assets/ExternalMutation')

const mutationRegistry = {
    ConjDisjMutIndiv:{
        name : "[Individual]Conjunction to Disjunction",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,num){
            return disjConjMut.disjConjMut(obj,"indiv",num,"ConjDisj")
        },
    },
    ConjDisjMutSumm:{
        name : "[Summary]Conjunction to Disjunction",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,num){
            return disjConjMut.disjConjMut(obj,"summ",num,"ConjDisj")
        },
    },
    DisjConjMutIndiv:{
        name  : "[Individual]Disjunction to Conjunction",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,num){
            return disjConjMut.disjConjMut(obj,"indiv",num,"DisjConj")
        },
    },
    DisjConjMutSumm:{
        name  : "[Summary]Disjunction to Conjunction",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,num){
            return disjConjMut.disjConjMut(obj,"summ",num,"DisjConj")
        },
    },
    RelOpMutIndiv:{
        name : "[Individual]Relational Operator Mutation",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,num){
            return relOpMut.relOpMut(obj,"indiv",num)
        },
    },
    RelOpMutSumm:{
        name : "[Summary]Relational Operator Mutation",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,num){
            return relOpMut.relOpMut(obj,"summ",num)
        },
    },
    AriOpMutIndiv:{
        name : "[Individual]Arithmetical Operator Mutation",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,num){
            return ariOpMut.ariOpMut(obj,"indiv",num)
        },
    },
    AriOpMutSumm:{
        name : "[Summary]Arithmetical Operator Mutation",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,num){
            return ariOpMut.ariOpMut(obj,"summ",num)
        },
    },
    PredNegMutIndiv:{
        name : "[Individual]Predicate Negation Mutation",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,num){
            return predNegMut.predNegMut(obj,"indiv",num)
        },
    },
    PredNegMutSumm:{
        name : "[Summary]Predicate Negation Mutation",
        enable: true,
        external: false,
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,num){
            return predNegMut.predNegMut(obj,"summ",num)
        },
    },
    DropClauseMutationIndiv:{
        name : "[Individual]Drop Clause Mutation",
        enable: true,
        external: true,
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: async function(file,num){
            return await externalMutation.externalMutation(file,`drop-clause-mutation/indiv/${num}`)
        }
    },
    DropClauseMutationSumm:{
        name : "[Summary]Drop Clause Mutation",
        enable: true,
        external: true,
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: async function(file,num){
            return await externalMutation.externalMutation(file,`drop-clause-mutation/summ/${num}`)
        }
    },
}

module.exports = {
    mutationRegistry:mutationRegistry,
}