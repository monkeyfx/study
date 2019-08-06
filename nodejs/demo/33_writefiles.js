const fs = require('fs');

const content = Buffer.from('this is a test.111');

fs.writeFile('./test.txt',content,{
   encoding:'utf8'
},err => {
    if(err){
          throw  error;
    }
    console.log('done!');
});