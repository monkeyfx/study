const EventEmitter  = require('events');

class CustomEvent extends EventEmitter{

}

function fn1(){
    console.log('fn1');
}

function fn2(){
    console.log('fn1');
}

const ce = new CustomEvent();
ce.on('test1',fn1);
ce.on('test1',fn2);

setTimeout(()=>{
    ce.emit('test1');
},500);


/*
setInterval(()=>{
    ce.removeListener('test1',fn1);
    ce.removeAllListener('test1',fn2);
},1500);
*/


