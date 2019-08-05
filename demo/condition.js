function test(n) {
    console.log(n);
}

for (let i = 0; i < 7;i++){
    const n = parseInt(Math.random() * 10);
    test(n);
}