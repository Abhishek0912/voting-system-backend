// import modules
const express = require('express');
const cors = require('cors'); 
const http = require('http')
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session')

require('dotenv').config();

// import db service
const services = require('./services')

// initialize express app
const app = express();
// enable cors
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
}))

// initialize httpServer and attach express app
const httpServer = http.createServer(app)

// initialize socker.io server and attach it to httpServer
const io = new Server(httpServer, {
  cors: {
    credentials: true, 
    origin: 'http://localhost:3001'
  }
});


const users = [
  {
    id: 1,
    username:process.env.ADMINUSER,
    password:process.env.ADMINPASSWORD
  },
];

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(password);
  console.log(users[0].password)
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(200).json({ success:false,message: 'User not found' });
  }

  try {
   // if (await bcrypt.compare(password, user.password)) {
    if(password==user.password){
      return res.status(200).json({ success: true, message: 'User LoggedIn Successfully' });
    } else {
      return res.status(200).json({ success:false,message: 'Invalid password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success:false,message: 'Internal server error' });
  }
});

// initializes the DB with the default table and nominees
//app.get('/seeder', async (req, res) => {
async function seeder(){
  try{

    await services.seeder();

    //res.status(200).json({ success: true, message: 'Success running seeder' });

  }catch(error){
    console.error('Error running seeder:', error);
   // res.status(500).json({ success: false, message: 'Error running seeder' });
  }
}
//})
seeder();
//get all nominess
app.get('/nominees', async (req, res) => {
  try {

    const data = await services.getAllNominees();

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error fetching Nominees:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch Nominees' });
  }
});

// vote for a nominee
app.post('/vote/:nomineeId', async (req, res) => {
    const { nomineeId } = req.params;

    if(req.session.voted){
      return res.status(400).json({
        success: false,
        message: "Already Voted"
      });
    }

    req.session.voted = true

    try {
      
      await services.vote(nomineeId);
      const updatedData = await services.getNomineesData();
      const totalCounts=await services.countVotes();

      io.emit("updateData", {
        success: true,
        data: updatedData,
        totalCounts:totalCounts

      });

      // response
      res.status(200).json({ success: true, message: "You Have Given Vote Successfully" });
    } catch (error) {
      console.error('Error submitting vote:', error);
      res.status(500).json({ success: false, message: 'Failed to submit vote' });
    }
 });

app.get('/votes', async (req, res) => {
    try {

      const data = await services.getNomineesData();

      res.status(200).json({
        success: true,
        data: data
      });

    } catch (error) {
      console.error('Error fetching vote counts:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch vote counts' });
    }
});

app.get('/voted', async (req, res) => {
  return res.json({
    "value": req.session.voted ?? false
  })
})

io.on('connection',  (socket) => {
  console.log('A client connected');
  
  // Fetch records initially and emit to the client
  services.getNomineesData().then(async (data) => {
   const totalCounts=await services.countVotes();
    socket.emit("initialData",{
      success: true,
      data: data,
      totalCounts:totalCounts
    })
  });

  socket.conn.on("close", (reason) => {
    console.log("Client Disconnected")
  });
});

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});