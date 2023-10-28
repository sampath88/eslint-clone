let text = 'abc123' + 'cde9982';
let age = 20;
const neverReassigned = {};
neverReassigned.name = 'sampath';
let tobeReassigned = {};
tobeReassigned = {
  name: 'ana'
};
tobeReassigned.name = 1;
tobeReassigned = 0;
tobeReassigned = {
  name: 'ana'
};
age = 30;
text = 'sampath';
const result = text.split(',').map(letter => {
  return letter.toUpperCase();
}).join('.');
console.log(result);
