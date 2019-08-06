const fs = require('fs');
const promisify = require('util').promisify;

const read = promisify(fs.readFile);

read('./43_promisify.js').then(data =>{
   console.log(data);
}).catch(ex=>{
    console.log(ex);
});

async function test() {
    await read
}