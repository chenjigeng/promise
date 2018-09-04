function batches(recipe, available) {
  console.log(Math.floor);
  return Math.floor(Math.min(...Object.keys(recipe).map((key) => available[key] / recipe[key] | 0)));
}

console.log(batches(
  { milk: 2, sugar: 40, butter: 20 },
  { milk: 5, sugar: 120, butter: 500 }
));


function fibArr(n) {
  return [...Array(n)].reduce((arr, val, index) => arr.concat(index > 1 ? arr[index - 2] + arr[index - 1] : index), []);
}

console.log(fibArr(5));

function bind(func, obj) {
  return (...args) => func.apply(obj, args);
}

function example() {
  console.log(this)
}
const boundExample = bind(example, { a: true })
boundExample.call({ b: true }) // logs { a: true }

function mask(str, maskStr = "#") {
  return maskStr.repeat(str.slice(0, -4).length) + str.slice(-4);
}

console.log(mask("123123233"));

function pipe(...funcs) {
  return (...args) => funcs.reduce((result, currentFun) => currentFun(result), args);
}

const square = v => v * v
const double = v => v * 2
const addOne = v => v + 1
const res = pipe(square, double, addOne)
console.log(res(3)) // 19; addOne(double(square(3)))
