const fs = require('fs');

fs.rmdir('./test',err=>{
    console.log('remove dir success');
});