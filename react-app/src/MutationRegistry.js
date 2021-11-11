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
        mode: "indiv",
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"ConjDisj")
        },
    },
    ConjDisjMutSumm:{
        name : "[Summary]Conjunction to Disjunction",
        enable: true,
        external: false,
        mode: "summ",
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"ConjDisj")
        },
    },
    DisjConjMutIndiv:{
        name  : "[Individual]Disjunction to Conjunction",
        enable: true,
        external: false,
        mode: "indiv",
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"DisjConj")
        },
    },
    DisjConjMutSumm:{
        name  : "[Summary]Disjunction to Conjunction",
        enable: true,
        external: false,
        mode: "summ",
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"DisjConj")
        },
    },
    RelOpMutIndiv:{
        name : "[Individual]Relational Operator Mutation",
        enable: true,
        external: false,
        mode:"indiv",
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,mode){
            return relOpMut.relOpMut(obj,mode)
        },
    },
    RelOpMutSumm:{
        name : "[Summary]Relational Operator Mutation",
        enable: true,
        external: false,
        mode:"summ",
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,mode){
            return relOpMut.relOpMut(obj,mode)
        },
    },
    AriOpMutIndiv:{
        name : "[Individual]Arithmetical Operator Mutation",
        enable: true,
        external: false,
        mode: "indiv",
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,mode){
            return ariOpMut.ariOpMut(obj,mode)
        },
    },
    AriOpMutSumm:{
        name : "[Summary]Arithmetical Operator Mutation",
        enable: true,
        external: false,
        mode: "summ",
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,mode){
            return ariOpMut.ariOpMut(obj,mode)
        },
    },
    PredNegMutIndiv:{
        name : "[Individual]Predicate Negation Mutation",
        enable: true,
        external: false,
        mode:"indiv",
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: function (obj,mode){
            return predNegMut.predNegMut(obj,mode)
        },
    },
    PredNegMutSumm:{
        name : "[Summary]Predicate Negation Mutation",
        enable: true,
        external: false,
        mode:"summ",
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: function (obj,mode){
            return predNegMut.predNegMut(obj,mode)
        },
    },
    DropClauseMutationIndiv:{
        name : "[Individual]Drop Clause Mutation",
        enable: true,
        external: true,
        mode:"indiv",
        defaultOpt: {
            checked: true,
            numMut: 10
        },
        mutation: async function(file,mode){
            return await externalMutation.externalMutation(file,mode,"drop-clause-mutation")
        }
    },
    DropClauseMutationSumm:{
        name : "[Summary]Drop Clause Mutation",
        enable: true,
        external: true,
        mode:"summ",
        defaultOpt: {
            checked: true,
            numMut: 1000
        },
        mutation: async function(file,mode){
            return await externalMutation.externalMutation(file,mode,"drop-clause-mutation")
        }
    },
}

module.exports = {
    mutationRegistry:mutationRegistry,
}