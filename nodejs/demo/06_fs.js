const fs = require('fs');
const  result = fs.readFile('./06_fs.js1',(err,data)=>{
    if(err){
        console.log(err);
    }else{
        console.log(data.toString());
    }
    console.log(data);
});


console.log(result);