const express=require("express");
const path=require("path");
const app=express();
const port=8080;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
const mongoose = require('mongoose');
const initDb=require("./init/data.js")
const User=require("./model/user.js")
const User1=require("./model/new.js")
main().then(()=>{
  console.log("DB is connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userManage');
}
const DBstore=async()=>{
  await User.deleteMany({});
  await User.insertMany(initDb.data);
}
DBstore();

//Show route
app.get("/",async(req,res)=>{
  let user= await User.find();
  res.render("index.ejs",{data:user})
});


// Delete Users

app.delete("/delete/:id",async(req,res)=>{
  const {id}=req.params;
  console.log(id);
 // user=user.filter((p)=>id!=p.Id);
  let deleteUser=await User.findByIdAndDelete(id);
  res.redirect("/");
});


//Add New User
app.get("/new",(req,res)=>{
  res.render("add.ejs")
})
app.post("/new",(req,res)=>{
  //let Id=uuidv4();
  const {Id,name,age,email}=req.body;
  
  let newUser=new User({
    name:name,
    age:age,
    email:email,
  });
  newUser
  .save()
  .then((res)=>{
    console.log("Data is saved");
  })
  .catch((err)=>{
    console.log("Some thing went Wrong")
  })
  res.redirect("/");
  console.log(user);
});


//Update User
app.get("/update/:id",(req,res)=>{
  let singleUser=req.body;
  res.render("Update.ejs",{singleUser});
})
app.patch("/update/:id",async(req,res)=>{
  const inputUserName = req.body.name
  const inputUserEmail = req.body.email
  const inputUserAge = req.body.age
  const inputUserUniqueId = req.body.id;
    


  await User.findByIdAndUpdate(inputUserUniqueId,{...req.body},{ new: true }
  )
 
res.redirect("/");
})

app.listen(port,(req,res)=>{
  console.log(`our server is ${port}`)
});