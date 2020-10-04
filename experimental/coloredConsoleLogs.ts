/**
 * Prints some colors in the console
 */
console.log("%cteal", "color:hsl(185, 51%, 81%)");
console.log("%cpurple", "color:hsl(185, 51%, 81%)");
console.log("%cmauve", "color:hsl(280, 29%, 79%)");
console.log(
  "%cmauve",
  "color:hsl(280, 29%, 79%);background-color:hsl(280, 29%, 79%)"
);

const x = "hsl(280, 29%, 79%)%";

const test = x.replace(/(79%)/, "[$1]");
console.log(test);

let tss = /((!?\[[^\]]*?\])\((?:(?!http|www\.|\#|\.com|\.net|\.info|\.org).)*?\))/g;
let tss2 = /^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/g;

const md = "[View the analytics docs](https://getanalytics.io/)";

const regex = /^\[([\w\s\d]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#]+)\)$/;

const string = "[View the analytics docs](https://getanalytics.io/)";

const myMatch = string.match(regex);
console.log(myMatch);
