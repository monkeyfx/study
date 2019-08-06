const fs = require('fs');
fs.readdir('./',(err,file)=>{
    if(err) throw  err;
    console.log(file);
});