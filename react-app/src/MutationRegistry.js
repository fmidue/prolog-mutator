const disjConjMut = require('./assets/DisjConjMut')
const relOpMut = require('./assets/RelOpMut')
const ariOpMut = require('./assets/AriOpMut')
const predNegMut = require('./assets/PredNegMut')
const externalMutation = require('./assets/ExternalMutation')

const mutationRegistry = {
    ConjDisjMut:{
        name : "Conjunction to Disjunction",
        enable: true,
        external: false,
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"ConjDisj")
        },
    },
    DisjConjMut:{
        name  : "Disjunction to Conjunction",
        enable: true,
        external: false,
        mutation: function (obj,mode){
            return disjConjMut.disjConjMut(obj,mode,"DisjConj")
        },
    },
    RelOpMut:{
        name : "Relational Operator Mutation",
        enable: true,
        external: false,
        mutation: function (obj,mode){
            return relOpMut.relOpMut(obj,mode)
        },
    },
    AriOpMut:{
        name : "Arithmetical Operator Mutation",
        enable: true,
        external: false,
        mutation: function (obj,mode){
            return ariOpMut.ariOpMut(obj,mode)
        },
    },
    PredNegMut:{
        name : "Predicate Negation Mutation",
        enable: true,
        external: false,
        mutation: function (obj,mode){
            return predNegMut.predNegMut(obj,mode)
        },
    },
    DropClauseMutation:{
        name : "Drop Clause Mutation",
        enable: true,
        external: true,
        mutation: async function(file,mode){
            return await externalMutation.externalMutation(file,mode,"drop-clause-mutation")
        }
    },
}

module.exports = {
    mutationRegistry:mutationRegistry,
}