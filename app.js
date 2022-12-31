const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// mysql -h mysql-101990-0.cloudclusters.net -P 10157 -u admin -p

var db = mysql.createConnection({
    host: "mysql-101990-0.cloudclusters.net",
    user: "admin",
    password: "ng5kGc40",
    database: "paintora",
    port: 10157
});


var flag1=0;
var flag2=0;
var flag3=0;
// connecting to databases

db.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected!");
        db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'paintora';`,(err,tables)=>{
            // console.log(tables[2].TABLE_NAME);
            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "login_cred") flag1 = 1;
            }
        

            if(!flag1){
                var sql = "CREATE TABLE login_cred (name varchar(30),email varchar(50),passwd text);"
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("LOGIN_CRED created");
                    }
                });
            }

            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "paintings") flag2 = 1;
            }
 

            if(!flag2){
                var sql = "CREATE TABLE paintings (id int primary key auto_increment,name varchar(250),imgpath text,imaghere longtext,descp longtext);";
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("PAINTINGS created");
                    }
                });
            }

            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "contact") flag3 = 1;
            }


            if(!flag3){
                var sql = "CREATE TABLE contact (id int primary key auto_increment,name varchar(50),email varchar(60),message varchar(2000));"
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("CONTACT table created");
                    }
                });
            }
        });
     
    }
});



const upload = multer({storage:multer.memoryStorage()});



app.get("/",(req,res)=>{
    res.render('index');
});

app.get("/paintings", (req,res)=>{
    const sql = "SELECT * FROM paintings;";
    db.query(sql,(err,result,fields)=>{
        if(err) {
            res.send(err);
        }
        else{
            res.render("paintings",{products:result});
        }
    });
});

app.get("/imageUpload",(req,res)=>{
    res.render("imageUpload");
});

app.post("/imageUpload",upload.single('ProductImage'),(req,res)=>{
    var image = req.file.buffer.toString('base64');
     var name = req.body.name;
     var descp = req.body.descp;
     console.log(name);
     const sql = "INSERT INTO paintings VALUES(NULL,?,NULL,?,?);"  //primary key,name,imagePath,imageHere,descp
     db.query(sql,[name,image,descp],(err,result,fields)=>{
         if(err) console.log(err);
         else{
             console.log("image added to database");
             res.redirect("/paintings");
         }
     });
 });

app.get("/contact", (req,res)=>{
    res.render("contact");
});

app.post("/contact",(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const sql = "INSERT INTO contact values (NULL,?,?,?)";
    db.query(sql,[name,email,message],(err,result,fields)=>{
        if(err) console.log(err);
        else {
            console.log("feedback inserted");
            res.redirect("/");
        }
    });
});

app.get("/signin",(req,res)=>{
    res.render('signin');
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port,()=>{
    console.log(`Server is up & running at ${port}`);
});
