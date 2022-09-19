const mysql = require("mysql");
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"my_new_db",
});

con.connect((err)=>{
    if(err)
    throw err;
    console.log("connect./");
});


module.exports=con;