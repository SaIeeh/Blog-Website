//jshint esversion:6
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { functionsIn } = require("lodash");
var _ = require('lodash');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
mongoose.connect('mongodb://127.0.0.1:27017/blog-websiteDB' , {useNewUrlParser: true});

const app = express();
//GLOBAL VARIBALS




const postsSchema = {
  title: String ,
  content: String 
};
const Post = mongoose.model("posts", postsSchema);

//FUNCATIONS
function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}



/////////////////////////////////////////////////////////////////////
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({})
    .then((posts) => {
      const truncatedArray = posts.map((post) => ({
        title: post.title,
        content: truncateString(post.content, 30), // Truncate the content
      }));
      res.render("home", { homeStartingContent, posts: truncatedArray });
    })
    .catch((err) => {
      console.error('Error retrieving data:', err);
      res.status(500).send("Internal Server Error");
    });
});



app.get("/post" , function(req , res){
  res.render("post" , {posts:Post});
});

app.get("/posts/:topic", function(req, res) {
  const selectedTopic = req.params.topic; // Use req.params to get the topic from the URL parameter

  Post.find({ title: selectedTopic })
    .then((posts) => {
      if (posts.length >0 ) {
        // If matching posts are found, render the "post" template with the found post
        res.render("post", { posts: posts });
      } else {
        // If no matching post is found, render a "not found" message
        console.log("not found");
      }
    })
    .catch((err) => {
      console.error('Error retrieving post:', err);
      res.status(500).send("Internal Server Error");
    });
});


// app.get("/about" , function(req , res){
// res.render("about" , {aboutContent:aboutContent});
// })

// app.get("/contact" , function(req , res){
//   res.render("contact" , {contactContent:contactContent});
//   })

  app.get("/compose" , function(req , res){
    res.render("compose");
    })

  app.post("/" , function(req , res){

  const newPost = new Post({
    title:req.body.title , 
    content:req.body.postText
  })
  newPost.save().then(function () {
    console.log("Item inserted successfully!.");
    res.redirect("/");
  }).catch(function (error) {
    console.log(error);
  });
  res.redirect("/");
  }) 
  






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
