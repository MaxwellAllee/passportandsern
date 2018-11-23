const express = require("express");


const logger = require('morgan')
const bodyParser = require('body-parser')

const path = require("path");

const db = require("./models")
const passport = require("./utils/passport")
const PORT = process.env.PORT || 3001;
const app = express();

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize())
app.get("/api/test", passport.authenticate('jwt'),(req,res)=>{
  res.send("It's working!!")
})

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
db.sequelize.sync({force:true})
.then(()=>{
  app.listen(PORT, function() {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
  });
})
.catch(err => console.log(err))

