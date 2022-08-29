import mysql from "mysql2";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const PORT=3001;
const app = express();


//database connection

const connection = mysql.createConnection({
    host: 'database-1.chwhat0w1vcg.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'confero123',
    database: 'quickout'
})


//middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//endpoints
app.get('/',(req,res)=>{
    connection.connect()
    res.send("Server Started")
})

//fetch student details
app.get("/student/:id",(req,res)=>{
    console.log(req.params.id)
    const id = req.params.id
    var query = "SELECT * from userinfo where id="
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
            var b="Connection Success"
        b=b.concat(req.params.id)
        console.log(rows.length)
        if(rows.length==0){
            res.send({"message":"User Not Found"})
        }
        else{

            /*Data Sending */

            const name = rows[0]["name"];

            const gender = rows[0]["gender"];
            const email = rows[0]["email"];
            const branch = rows[0]["branch"];
            const room = rows[0]["room"];
            const city = rows[0]["city"];
            const mobile_no = rows[0]["mobile_number"];
            const pmobile_no = rows[0]["parent_mobile_number"];

            console.log({"message":"User Found"})
            res.send({"name":name,"gender":gender,"email":email,"branch":branch,"room":room,"city":city,"mobile":mobile_no,"pmobile":pmobile_no})
        }
    })

})

//Register Now
app.post("/register",async (req,res)=>{
    const user = req.body.article;
    const name = user.name;
    const role = "student";
    const id = user.id;
    const gender = user.gender;
    const email = user.email;
    const branch = user.branch;
    const room = user.room;
    const city = user.city;
    const mobile_no = user.mobile_no;
    const pmobile_no = user.pmobile_no;
    const password =await bcrypt.hash(user.password,10);
    console.log(name+id+gender+email+branch+room+city+mobile_no+pmobile_no+password);

    var sql = `INSERT INTO userinfo (name, role, id,gender, email,branch,room,city,mobile_number,parent_mobile_number,password) VALUES ("${name}","${role}","${id}","${gender}",
    "${email}","${branch}","${room}","${city}","${mobile_no}","${pmobile_no}","${password}" )`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      res.send({"message":"Success"})
    });
})


//Apply to outpass

app.post("/apply/:id",async (req,res)=>{
    const id = req.params.id
    var query = "SELECT * from userinfo where id="
    var name = ""
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
            var b="Connection Success"
        b=b.concat(req.params.id)
        console.log(rows.length)
        if(rows.length==0){
            res.send({"message":"User Not Found"})
        }
        
        else{
            name=rows[0]["name"]
        }
        console.log(name)
        const user = req.body.article;
        console.log(user)
        const to = user["to"]
        const type = user["type"]
        const reason = user["reason"]
        const days = user["days"]
        const status = "Not Approved"
        console.log(id+name+to+type+reason+days+status)
        // Insert into student table
        var sql = `INSERT INTO student_apply (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
    "${reason}","${days}","${status}" )`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Student Success")
    });

    if(to==="S.W.Dean"){
        console.log("dean")
        //insert into dean 
        
        var sql = `INSERT INTO dean_requests (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
    "${reason}","${days}","${status}" )`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log("DeanSuccess")
    });


    }
    else{
        console.log("caretaker")
        //Insert into caretaker table
        var sql = `INSERT INTO caretaker_requests (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
    "${reason}","${days}","${status}" )`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log("caretaker Success")
    });
    }
})


    // var sql = `INSERT INTO userinfo (name, role, id,gender, email,branch,room,city,mobile_number,parent_mobile_number,password) VALUES ("${name}","${role}","${id}","${gender}",
    // "${email}","${branch}","${room}","${city}","${mobile_no}","${pmobile_no}","${password}" )`;
    // connection.query(sql, function(err, result) {
    //   if (err) throw err;
    //   res.send({"message":"Success"})
    // });
})

//Caretaker Requests
app.get("/caretakerrequests",(req,res)=>{
    var query = "SELECT * from caretaker_requests"
    connection.query(query,(err,rows,fields)=>{
        if (err) throw err
        res.send(rows)
    })

})

//Care Taker Accepted
app.get("/caretakeraccepted",(req,res)=>{
    var query = "SELECT * from caretaker_accepted"
    connection.query(query,(err,rows,fields)=>{
        if (err) throw err
        res.send(rows)
    })

})

//Care Taker Forwarded
app.get("/caretakerforwarded",(req,res)=>{
    var query = "SELECT * from caretaker_forwarded"
    connection.query(query,(err,rows,fields)=>{
        if (err) throw err
        res.send(rows)
    })

})

//Dean rejected
app.get("/deanrejected",(req,res)=>{
    var query = "SELECT * from dean_rejected"
    connection.query(query,(err,rows,fields)=>{
        if (err) throw err
        res.send(rows)
    })

})
//Dean requests
app.get("/deanrequests",(req,res)=>{
    var query = "SELECT * from dean_requests"
    connection.query(query,(err,rows,fields)=>{
        if (err) throw err
        res.send(rows)
    })

})

//Dean Accepted
app.get("/deanaccepted",(req,res)=>{
    var query = "SELECT * from dean_accepted"
    connection.query(query,(err,rows,fields)=>{
        if (err) throw err
        res.send(rows)
    })

})

//Login
app.post("/login",async (req,res)=>{
    const user = req.body.article;
    const id = user.id;
    const password =user.password;

    console.log(id+password);

    var query = "SELECT * from userinfo where id="
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
            var b="Connection Success"
        b=b.concat(req.params.id)
        console.log(rows.length)
        if(rows.length==0){
            res.send({"message":"iid"})
        }
        else{
            const pwd = rows[0]["password"]
            console.log(`\n\n\n Password: ${password}\n Database pwd${pwd}\n\n\n`)
            bcrypt.compare(password,pwd)
            .then(correct=>{
                if(correct){
                    console.log("Login success")
                    console.log(rows[0]["role"])
                const payload = {
                    "uid": rows[0]["id"],
                    "urole" : rows[0]["role"]
                }
                jwt.sign(
                    payload,
                    "quickout",
                    {expiresIn: 86400},
                    (err,token)=>{
                        if(err) return res.json({message:err})
                        return res.json({
                            message: "Success",
                            token: "Bearer "+token
                        })
                    }
                    )
            }
            else{
                return res.json({
                    message : "ipwd"
                })
            }
            })
}
 
      })
})

// Security List
app.get("/securitylist",(req,res)=>{
    var query = "SELECT * from security_list"
    connection.query(query,(err,rows,fields)=>{
        if (err) throw err
        res.send(rows)
    })

})


//student list
app.get("/studentstatus/:id",(req,res)=>{
    console.log(req.params.id)
    const id = req.params.id;

    var query = "SELECT * from student_apply where id="
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
        console.log(rows.length)
        if(rows.length==0){
            console.log("NO")
        }
        else{
            res.send(rows);
        }
    })

})
//dean approved

app.get("/deanapproved/:id",(req,res)=>{
    console.log(req.params.id)
    const id = req.params.id;

    var query = "SELECT * from dean_requests where id="
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
        console.log(rows.length)
        if(rows.length==0){
            console.log("NO")
        }
        else{
            console.log(rows)
            const approval = "Not Approved"
            const approved = "Approved"
            const id = rows[0]["id"]
            const name = rows[0]["name"]
            const to = rows[0]["request_to"]
            const type = rows[0]["type_of_reason"]
            const reason = rows[0]["reason"]
            const no = rows[0]["no_of_days"]
            const status = "Approved"
            var query = "UPDATE student_apply set status='"+approved+"' where id="
            query=query.concat("'"+id+"'")
            console.log(query)
            connection.query(query, (err, rows, fields) => {
                if (err) throw err
                
            
            })


            var query=`INSERT INTO security_list (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
                "${reason}","${no}","${status}" )`;
                connection.query(query,(err,rows,fields)=>{
                    if(err) throw err
                   

                })
            var query=`INSERT INTO dean_accepted (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
               "${reason}","${no}","${status}" )`;
                connection.query(query,(err,rows,columns)=>{
                if(err) throw err
                })
            var query="DELETE from dean_requests where id="
            query=query.concat("'")
            query=query.concat(id)
            query=query.concat("'")
             connection.query(query,(err,rows,columns)=>{
            if(err) throw err
            })
                        
        console.log("Success")}
 
      })


})


//dean denied
app.get("/deandeny/:id",(req,res)=>{
    console.log(req.params.id)
    const id = req.params.id;

    var query = "SELECT * from dean_requests where id="
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
        console.log(rows.length)
        if(rows.length==0){
            console.log("NO")
        }
        else{
            console.log(rows)
            const approval = "Not Approved"
            const approved = "Rejected"
            const id = rows[0]["id"]
            const name = rows[0]["name"]
            const to = rows[0]["request_to"]
            const type = rows[0]["type_of_reason"]
            const reason = rows[0]["reason"]
            const no = rows[0]["no_of_days"]
           
            var query = "UPDATE student_apply set status='"+approved+"' where id="
            query=query.concat("'"+id+"'")
            console.log(query)
            connection.query(query, (err, rows, fields) => {
                if (err) throw err
                
            
            })

            var status = "Rejected"
            var query=`INSERT INTO dean_rejected (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
                "${reason}","${no}","${status}" )`;
                connection.query(query,(err,rows,fields)=>{
                    if(err) throw err
                   

                })
                var status = "Rejected"
                var query = "UPDATE caretaker_forwarded set status='"+approved+"' where id="
            query=query.concat("'"+id+"'")
            console.log(query)
            connection.query(query, (err, rows, fields) => {
                if (err) throw err
                
            
            })

            var query="DELETE from dean_requests where id="
            query=query.concat("'")
            query=query.concat(id)
            query=query.concat("'")
             connection.query(query,(err,rows,columns)=>{
            if(err) throw err
            })
                        
        console.log("Success")}
 
      })


})

//caretaker approve
app.get("/caretakerapproved/:id",(req,res)=>{
    console.log(req.params.id)
    const id = req.params.id;

    var query = "SELECT * from caretaker_requests where id="
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
        console.log(rows.length)
        if(rows.length==0){
            console.log("NO")
        }
        else{
            console.log(rows)
            const approval = "Not Approved"
            const approved = "Approved"
            const id = rows[0]["id"]
            const name = rows[0]["name"]
            const to = rows[0]["request_to"]
            const type = rows[0]["type_of_reason"]
            const reason = rows[0]["reason"]
            const no = rows[0]["no_of_days"]
            const status = "Approved"
            var query = "UPDATE student_apply set status='"+approved+"' where id="
            query=query.concat("'"+id+"' AND status='"+approval+"'")
            console.log(query)
            connection.query(query, (err, rows, fields) => {
                if (err) throw err
                
            
            })


            var query=`INSERT INTO security_list (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
                "${reason}","${no}","${status}" )`;
                connection.query(query,(err,rows,fields)=>{
                    if(err) throw err
                   

                })
            var query=`INSERT INTO caretaker_accepted (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
               "${reason}","${no}","${status}" )`;
                connection.query(query,(err,rows,columns)=>{
                if(err) throw err
                })
            var query="DELETE from caretaker_requests where id="
            query=query.concat("'")
            query=query.concat(id)
            query=query.concat("'")
             connection.query(query,(err,rows,columns)=>{
            if(err) throw err
            })
                        
        console.log("Success")}
 
      })


})


//care taker forward
app.get("/caretakerforwarded/:id",(req,res)=>{
    console.log(req.params.id)
    const id = req.params.id;

    var query = "SELECT * from caretaker_requests where id="
    query=query.concat("'")
    query=query.concat(id)
    query=query.concat("'")
    connection.query(query, (err, rows, fields) => {
        if (err) throw err
        console.log(rows.length)
        if(rows.length==0){
            console.log("NO")
        }
        else{
            console.log(rows)
            const approval = "Not Approved"
            const approved = "Forwarded"
            const id = rows[0]["id"]
            const name = rows[0]["name"]
            const to = rows[0]["request_to"]
            const type = rows[0]["type_of_reason"]
            const reason = rows[0]["reason"]
            const no = rows[0]["no_of_days"]
           
            var query = "UPDATE student_apply set status='"+approved+"' where id="
            query=query.concat("'"+id+"' AND status='"+approval+"'")
            console.log(query)
            connection.query(query, (err, rows, fields) => {
                if (err) throw err
                
            
            })

            var status = "Forwarded"
            var query=`INSERT INTO caretaker_forwarded (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
                "${reason}","${no}","${status}" )`;
                connection.query(query,(err,rows,fields)=>{
                    if(err) throw err
                   

                })
                var status = "Not Approved"
            var query=`INSERT INTO dean_requests (name, id,request_to, type_of_reason,reason,no_of_days,status) VALUES ("${name}","${id}","${to}","${type}",
               "${reason}","${no}","${status}" )`;
                connection.query(query,(err,rows,columns)=>{
                if(err) throw err
                })
            var query="DELETE from caretaker_requests where id="
            query=query.concat("'")
            query=query.concat(id)
            query=query.concat("'")
             connection.query(query,(err,rows,columns)=>{
            if(err) throw err
            })
                        
        console.log("Success")}
 
      })


})


// dean and caretaker
app.post("/registerdean",async (req,res)=>{
    const user = req.body.article;
    const name = user.name;
    const role = "dean";
    const id = user.id;
    
    const password =await bcrypt.hash(user.password,10);
    console.log(name+id+role+password);

    var sql = `INSERT INTO userinfo (name, role, id,password) VALUES ("${name}","${role}","${id}","${password}" )`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      res.send({"message":"Success"})
    });
})
//caretaker register
app.post("/registercaretaker",async (req,res)=>{
    const user = req.body.article;
    const name = user.name;
    const role = "caretaker";
    const id = user.id;
    
    const password =await bcrypt.hash(user.password,10);
    console.log(name+id+role+password);

    var sql = `INSERT INTO userinfo (name, role, id,password) VALUES ("${name}","${role}","${id}","${password}" )`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      res.send({"message":"Success"})
    });
})
//security
app.post("/registersecurity",async (req,res)=>{
    const user = req.body.article;
    const name = user.name;
    const role = "security";
    const id = user.id;
    
    const password =await bcrypt.hash(user.password,10);
    console.log(name+id+role+password);

    var sql = `INSERT INTO userinfo (name, role, id,password) VALUES ("${name}","${role}","${id}","${password}" )`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      res.send({"message":"Success"})
    });
})


//verify jwt
function verifyJWT(req,res,next){
    const token = req.headers["x-access-token"]?.split(' ')[1]
    if(token){
        jwt.verify(token,"quickout",(err,decoded)=>{
            if(err) return res.json({
                isLoggedIn: false,
                message: "Failed to Authenticate"
            })
            req.user = {};
            req.user.id = decoded.uid
            req.user.role = decoded.urole
            next()
        })
    }
    else{
        res.json({message: "Incorrect Token", isLoggedIn:false})
    }
}


app.get("/getUser",verifyJWT,(req,res)=>{
    res.json({ isLoggedIn: true, uid: req.user.id,urole:req.user.role})
})
//Server Started
app.listen(PORT,()=>{
    console.log(`Server Started: ${PORT}`)
})

