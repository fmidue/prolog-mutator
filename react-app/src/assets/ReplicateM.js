/*
Credits to https://gist.github.com/jmurinello/7ccea1cd441e24ae4e80d98ee7f1cdda
*/
'use strict'

const pair = (x, y) =>
  typeof x === 'number' ? [x].concat(y)
                        : x.concat(y)

const combine = (x, [y, ...ys]) =>
  typeof y === 'undefined' ? []
                           : [pair(x, y), ...combine(x, ys)]

const liftA2 = ([x, ...xs], ys) =>
  typeof x === 'undefined' ? []
                           : [...combine(x, ys), ...liftA2(xs, ys)]

const sequence = list => list.reduce(liftA2)

const replicate = (n, x) =>
  n === 0 ? [] : [x, ...replicate(n - 1, x)]

const replicateM = (n, x) => sequence(replicate(n, x))


module.exports ={
    replicateM:replicateM
}