const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");
const axios = require("axios");
const auth = require("./routes/auth.js");

const leaderboard = require("./routes/leaderboard");

const user = require("./routes/user.js");

const app = express();
const server = require('http').Server(app);
const PORT = 8000;
const axios = require("axios");

const requireLogin = require("./middleware/requireLogin.js");



connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // comment if this gives error.

app.use("/leaderboard", leaderboard);

app.use("/auth",auth);
app.use("/user",user);

var rooms = []
var removeRooms = []

function removingRooms() {

  console.log("ROOMS: " + rooms)
  if (removeRooms.length != 0) {
      for (let i = 0; i < removeRooms.length; i++) {
          if (io.sockets.adapter.rooms[removeRooms[i]] === undefined) {
              rooms = rooms.filter(function (item) {
                  return item !== removeRooms[i]
              })
          }
      }
  }
  removeRooms.splice(0,removeRooms.length)

  setTimeout(removingRooms, 60 * 60 * 1000);
}

function getLastValue(set){
  let value;
  for(value of set);
  return value;
}

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors:{
      origin:"http://localhost:3000",
      methods:['GET', 'POST']
  }
});

io.on("connection", socket => {
  const { id } = socket.client

  socket.on('created-room', msg => {
    rooms.push(msg)
  })

  // Check if room exists
  socket.on('room-id', msg => {
      let exists = rooms.includes(msg)
      socket.emit('room-check', exists)

  })

  // If code changes, broadcast to sockets
  socket.on('code-change', msg => {
      socket.broadcast.to(socket.room).emit('code-update', msg)

  })

  // Send initial data to last person who joined
  socket.on('user-join', msg => {
      let room = io.sockets.adapter.rooms.get(socket.room);
      let lastPerson = getLastValue(room);
      io.to(lastPerson).emit('accept-info', msg);
  })

  // Add room to socket
  socket.on('join-room', msg => {
      socket.room = msg.id
      socket.join(msg.id);
    
      let room = io.sockets.adapter.rooms.get(socket.room);
      if (room.size > 1) {
          var it = room.values();

          var first = it.next();
          let user = first.value;
          console.log("first-->" + user);
          // let user = Object.keys(room.sockets)[0]
          io.to(user).emit('request-info', "");
      };
      socket.emit('receive-message', { sender: 'admin', text: `${msg.nameOfUser}, welcome to room.`});
      socket.broadcast.to(socket.room).emit('receive-message', { sender: 'admin', text: `${msg.nameOfUser} has joined!` });
      io.sockets.in(socket.room).emit('joined-users', room.size)
  })

  


  // If language changes, broadcast to sockets
  socket.on('language-change', msg => {
      io.sockets.in(socket.room).emit('language-update', msg)
  })

  // If title changes, broadcast to sockets
  socket.on('title-change', msg => {
      io.sockets.in(socket.room).emit('title-update', msg)
  })

  socket.on('sendMessage', ({message, sender}) => {
    io.to(socket.room).emit('receive-message', { sender: sender, text: message });
  });

  // If connection is lost
  socket.on('disconnect', () => {
      console.log(`User ${id} disconnected`)
  })

  socket.on('leaving', (msg)=>{
    try {
        let room = io.sockets.adapter.rooms.get(socket.room)
        io.sockets.in(socket.room).emit('joined-users', room.size - 1)
        socket.broadcast.to(socket.room).emit('receive-message', { sender: 'admin', text: `${msg.nameOfUser} has left!` });
        if (room.size === 1) {
            socket.leave(socket.room)
            removeRooms.push(socket.room)
        }
    }
    catch (error) {
        console.log("Leaving error")
    }
  })

  // Check if there is no one in the room, remove the room if true
  socket.on('disconnecting', () => {
      try {
          let room = io.sockets.adapter.rooms.get(socket.room)
          io.sockets.in(socket.room).emit('joined-users', room.size - 1)
          if (room.size === 1) {
              console.log("Leaving Room " + socket.room)
              socket.leave(socket.room)
              removeRooms.push(socket.room)
          }
      }
      catch (error) {
          console.log("Disconnect error")
      }
  })
})


app.post('/execute', async (req, res)=>{
  console.log(req.body);
  const { script, language, stdin, versionIndex } = req.body;

  const response = await axios({
      method: "POST",
      url: "https://api.jdoodle.com/v1/execute",
      data: {
        script: script,
        stdin: stdin,
        language: language,
        versionIndex: versionIndex,
        clientId: "9066b36a3c1a53229835529ce9830641",
        clientSecret: "dab07eaa775ffedd1282e5b2f501701599fe2556928ef3a94eca01e8ed290fd5"
      },
      responseType: "json",
    });

  res.json(response.data);
})

removingRooms();


server.listen(PORT, () => {
  console.log("server working on port ", PORT);
});


