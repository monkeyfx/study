const fs = require('fs');

fs.rename('./test','test.log',err=>{
    if(err) throw  err;

    console.log('rename success');
})