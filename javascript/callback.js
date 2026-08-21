function usercheck(x,y){
    const pass=12345;
    const user="admin";
    if(x==user && y==pass) return true;
    else return false;
}
function login(x){
    const result=x("admin",12345);
    if(result){
        console.log("You are logged in");
    }
    else{
        console.log("Wrong Credentials");
    }
}
login(usercheck);