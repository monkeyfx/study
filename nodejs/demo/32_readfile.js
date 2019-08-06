const fs = require('fs');

fs.readFile('./32_readfile.js','utf8',(err,data)=>{
   if(err)throw err;
   console.log(data);
});

fs.readFile('./32_readfile.js',(err,data)=>{
    if(err)throw err;
    console.log(data.toString());
});

const  data = fs.readFileSync('./32_readfile.js','utf8');

console.log(data);