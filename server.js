require('dotenv').config()
const express = require("express");


const logger = require('morgan')
const bodyParser = require('body-parser')

const path = require("path");

const db = require("./models")
const passport = require("./utils/passport")
const PORT = process.env.PORT || 3001;
const app = express();
const jwt = require('jsonwebtoken')
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/login", (req, res)=> {
  const {email, password } =req.body
  db.User.findOne({
    where: {
    email
  }
  })
  .then(user => {

    if (!user) {
      return res.status(401).json({success: false, msg: "Authentication failed."})
    }
    
    if (password === user.password){
      console.log(process.env.SECRET)
      const token = jwt.sign(user.toJSON(),  process.env.SECRET);
        res.json({success: true, token: 'JWT ' + token})
    }
    else {
      res.status(401).send({success: false, msg: "Authentication failed. Wrong password"})
     }
  })
  .catch(err => console.log(err))
})



app.use(passport.initialize())
app.get("/api/test", passport.authenticate('jwt',{session:false}),( req,res)=>{
  res.send("It's working!!")
})
app.get("/api/message", passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: "Hello world" });
})
// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
db.sequelize.sync({force:false})
.then(()=>{
  app.listen(PORT, function() {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
  });
})
.catch(err => console.log(err))

