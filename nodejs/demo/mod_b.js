module.exports.test = 'B';

const  modA = require('./mod_a');
console.log('modB:',modA.test);

module.exports.test = 'BB';