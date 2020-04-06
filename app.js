var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
mongoose.connect("mongodb://localhost/restful_blog_db",{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.set("view-engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//blog Config
var blogSchema =new mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created: {type: Date,default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
//     title: "TEst-Blog", image: "https://images.pexels.com/photos/1054289/pexels-photo-1054289.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     body: "lorem lnxnwckjnwcbo owhhiwhfid ijochibie ohicsibe hciie ibicb ibfieivbe ibc hbc duih ubi whief ihhfiurf ibbi iif b10",
// },function(err,blog){
//     if(err)
//     console.log(err);
//     else
//     console.log(blog);
//     });
//ROUTES
//INDEX route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        console.log(err);
        else
        res.render("index.ejs",{blogs: blogs});
    })
  
});
//NEW routre
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});
//CREATE route
app.post("/blogs",function(req,res){
    //create blog
    var blog = req.body.blog;
   blog.body = req.sanitize(blog.body);
    Blog.create(blog,function(err,newBlog){
        if(err)
        res.render("new.ejs");
        else{
        //redirect to index
        res.redirect("/blogs");}
    });
    
});
//SHOW route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.render("show.ejs",{blog: foundBlog});
    });
    //res.render("show.ejs");
});
//EDIT route(new+show)
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.render("edit.ejs",{blog: foundBlog});
    })
});

//UPDATE route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //it should take post by id and update and redirect
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        res.redirect("/blogs");
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
//DELETE route
app.delete("/blogs/:id",function(req,res){
    //destroy and redirect somewhere
   Blog.findByIdAndRemove(req.params.id,req.body.blog,function(err){
       if(err)
       res.redirect("/blogs");
       else
       res.redirect("/blogs");
   });
    
});

port = process.env.PORT || 3000 ;
app.listen(port,function(){
    console.log("Server IS Running");
});