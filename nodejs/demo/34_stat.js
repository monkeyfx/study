const fs = require('fs');

fs.stat('./34_stat.js1',(err,stats)=>{
    if(err){
       console.log('文件不存在');
       return;
    }// throw  err;

    console.log(stats.isFile());
    console.log(stats.isDirectory());
    console.log(stats);
});