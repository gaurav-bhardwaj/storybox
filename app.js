//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "It's your space to digitally pen down your imagination, expressions and feelings about people or events and publish them to entertain your friends, family, colleagues and people around world.";
const contactContent = "Please provide your details and we will keep you posted with new addition of stories in story box";
const aboutContent = "Cloud learner and developer working on a capstone project";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

mongoose.connect(`${process.env.cosmodb}`,{ useUnifiedTopology: true, useNewUrlParser: true });


const viewsSchema = new mongoose.Schema({
  vsummary:String,
  vdetail:String
  });

  const View = mongoose.model("View",viewsSchema);

  const userSchema = new mongoose.Schema({
    name:String,
    email:String
    });

    const User = mongoose.model("User",userSchema);


  const view1 = new View({
    vsummary : "An Old Man Lived in the Village",
    vdetail : "An old man lived in the village. He was one of the most unfortunate people in the world. " +
              "The whole village was tired of him; he was always gloomy, he constantly complained and was always in a bad mood. " +
              "The longer he lived, the more bile he was becoming and the more poisonous were his words. People avoided him, because his misfortune became contagious."+
              "It was even unnatural and insulting to be happy next to him. He created the feeling of unhappiness in others. But one day, when he turned eighty years old, an incredible thing happened. "+
              "Instantly everyone started hearing the rumour:" +
              "The whole village gathered together. The old man was asked:Villager: What happened to you?"+
              "\u0022 \nNothing special. Eighty years I’ve been chasing happiness, and it was useless. And then I decided to live without happiness and just enjoy life. That’s why I’m happy now.” – An Old Man"
  });
  const view2 = new View({
    vsummary : "Eagles in a Storm",
    vdetail : "Did you know that an eagle knows when a storm is approaching long before it breaks?"+
            "The eagle will fly to some high spot and wait for the winds to come. When the storm hits, it sets its wings so that the wind will pick it up and lift it above the storm. While the storm rages below, the eagle is soaring above it."+
            "The eagle does not escape the storm. It simply uses the storm to lift it higher. It rises on the winds that bring the storm."+
            "When the storms of life come upon us – and all of us will experience them – we can rise above them by setting our minds and our belief toward God. The storms do not have to overcome us. We can allow God’s power to lift us above them."+
            "God enables us to ride the winds of the storm that bring sickness, tragedy, failure and disappointment in our lives. We can soar above the storm."+
            "Remember, it is not the burdens of life that weigh us down, it is how we handle them."
  });

  const defaultViews = [view1,view2];

app.get("/", function(req, res){

  View.find({},function(err,foundViews){
    if (foundViews.length===0){
      View.insertMany(defaultViews, function(err){
        if(err){
          console.log("Error");
        }  else{
            console.log("Success");
          }
        });
        res.redirect("/");
    } else{
      res.render("home", {
        startingContent: homeStartingContent,
        views: foundViews
        });
    }
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

const title = req.body.postTitle;
const content = req.body.postView;

    const view = new View({
      vsummary: title,
      vdetail: content
    });

  view.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

});

app.post("/contact", function(req, res){

const  name = req.body.uname;
const  email = req.body.email;

    const user = new User({
      name: name,
      email: email
    });

  user.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

});


app.get("/views/:viewID", function(req, res){
  const requestedViewId = req.params.viewID;
  View.findOne({_id: requestedViewId}, function(err, viewid){
if(err){
  console.log("Error");
}else{
   res.render("view", {
     title: viewid.vsummary,
     content: viewid.vdetail
   });
}
 });
});


let port = process.env.PORT;
if (port== null || port == ""){
  port = 3000;
}

app.listen(port,function(){
  console.log("Server started on port 3000");
});
