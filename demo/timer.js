setTimeout(()=>{
   console.log('timeout');
},0);

process.nextTick(()=>{
   console.log('nextTick');
});