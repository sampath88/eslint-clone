let text = "abc123" + "cde9982";
var neverReassigned = {}
neverReassigned.name = "sampath";

var tobeReassigned = {};
tobeReassigned = { name: "ana" };
tobeReassigned.name = 1;
tobeReassigned = 0;
tobeReassigned = { name: "ana" };
let result = text
  .split(",")
  .map((letter) => {
    return letter.toUpperCase();
  })
  .join(".");

console.log(result);
