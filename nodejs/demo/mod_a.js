module.exports.test = 'a';

const  modB  =require('./mod_b');
console.log('modA:',modB.test);

module.exports.test = 'AA';
