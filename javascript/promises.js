function f1(){
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
        console.log("hiii");
        resolve();
    },4000);
    })
};
function f2(){
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
        console.log("ABes college");
        resolve();
    },2000);
    })
};
f1().then(f2)
    .catch((err)=>{
        console.log("error",err)
    })

async function runTasks() {
    try {
        await f1(); 
        await f2(); 
    } catch (err) {
        console.log("error", err);
    }
}
runTasks();

