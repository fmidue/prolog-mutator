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
        mutation: function (obj,opt){
            return disjConjMut.disjConjMut(obj,"indiv",opt,"ConjDisj")
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
        mutation: function (obj,opt){
            return disjConjMut.disjConjMut(obj,"summ",opt,"ConjDisj")
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
        mutation: function (obj,opt){
            return disjConjMut.disjConjMut(obj,"indiv",opt,"DisjConj")
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
        mutation: function (obj,opt){
            return disjConjMut.disjConjMut(obj,"summ",opt,"DisjConj")
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
        mutation: function (obj,opt){
            return relOpMut.relOpMut(obj,"indiv",opt)
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
        mutation: function (obj,opt){
            return relOpMut.relOpMut(obj,"summ",opt)
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
        mutation: function (obj,opt){
            return ariOpMut.ariOpMut(obj,"indiv",opt)
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
        mutation: function (obj,opt){
            return ariOpMut.ariOpMut(obj,"summ",opt)
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
        mutation: function (obj,opt){
            return predNegMut.predNegMut(obj,"indiv",opt)
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
        mutation: function (obj,opt){
            return predNegMut.predNegMut(obj,"summ",opt)
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
        mutation: async function(file,opt){
            return await externalMutation.externalMutation(file,"indiv",opt,"drop-clause-mutation")
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
        mutation: async function(file,opt){
            return await externalMutation.externalMutation(file,"summ",opt,"drop-clause-mutation")
        }
    },
}

module.exports = {
    mutationRegistry:mutationRegistry,
}