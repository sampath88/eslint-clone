var text = "abc123" + "cde9982";
var age = 20;
var neverReassigned = {};
neverReassigned.name = "sampath";

var tobeReassigned = {};
tobeReassigned = { name: "ana" };
tobeReassigned.name = 1;
tobeReassigned = 0;
tobeReassigned = { name: "ana" };
age=30;
text="sampath"
let result = text
  .split(",")
  .map((letter) => {
    return letter.toUpperCase();
  })
  .join(".");

console.log(result);
