const {normalize} = require('path');
// const normaliza = require('path').normalize;

console.log(normalize('/user//local/bin'));
console.log(normalize('/user//local/../bin'));