/*
Credits to https://gist.github.com/jmurinello/7ccea1cd441e24ae4e80d98ee7f1cdda
*/
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

const replicateM = (n, x, bin) => {
  var tempRes = sequence(replicate(n, x))
  if (bin){
    var res = removeZeros(tempRes)
    return res
  }
  return tempRes
}

function removeZeros(arr){
  arr.forEach((x,index)=>{
    var remove = true;
    if (Array.isArray(x)){
      x.forEach(char=>{
        if (char !== 0){
          remove = false
        }
      })
    }
    if (remove){
      arr.splice(index,1)
    }
  })
  return arr
}

module.exports ={
    replicateM:replicateM
}