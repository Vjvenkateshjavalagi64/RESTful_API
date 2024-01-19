const express= require("express");
const app =express();
const users= require("./MOCK_DATA.json")
const fs= require("fs")


/*--------------------------Routing operations-----------------------*/

 // Middlleware 1
app.use(express.urlencoded({extended : false})) 

 // Middleware 2 
app.use((req,res,next)=>{                                                                 
    fs.appendFile("log.txt",  `${Date.now()}: ${req.method}:  ${req.path}\n`, ()=>{       // Here in this only we created the log file it store log data                                                                   /* */
    next();
    })
})

//Read all users data 
app.get("/api/users",(req,res)=>{
    return res.json(users)
})

//Read all users name only and displaying in list 
app.get("/users",(req,res)=>{
    const html=`
    <ul>
        ${ users.map((user)=>`<li> ${user.first_name}</li>`).join("") }
    </ul>
    `;
    res.send(html);
})

// Create new data and append that to file
app.post("/api/users", (req,res)=>{
    const body=req.body;
    users.push({id :users.length+1, ...body})
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),  () =>{
            return res.json({ status: "Success", id: users.length });
        })    
})

//Get the user by ID
app.route("/api/users/:id")
.get( (req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    return res.json(user);
})

.delete((req,res)=>{
    // Delete user by ID
    const id=Number(req.params.id);
    var index= users.map((user)=> user.id).indexOf(id);
    if(index==-1) {
        res.statusCode=404;
         res.send("ERROR :404 ,data not found")
    }
    else{
         users.splice(index,1);
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), ()=>{
            res.send("successfully deleted the data")
        })
    }
    return res.json({status: "Pending i am in delete", id: index});
});



app.patch('/api/users/:id/:name', (req, res) => {
    const id = Number(req.params.id);
    const newName = req.params.name;
    const user = users.find((user) => user.id === id);
    
    user.first_name = newName;

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: 'Error updating user' });
        }

        return res.json({ status: 'Successfully updated' });
    });
});

app.listen(8000, ()=>{
    console.log("Server started successfully 8000");
})




