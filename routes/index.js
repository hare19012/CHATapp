var express = require('express');
var router = express.Router();
var db = require("../konekcija.js");
var io;
var room = "123";

// GET home page.
let onlineUsers = {};

router.get('/', function(req, res, next) {
  // Generating a random name consisting of 8 characters, with the first letter capitalized
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var poruke = [];
  var name = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

  for (var i = 0; i < 7; i++) {
    var randomLetter = alphabet.charAt(Math.floor(Math.random() * alphabet.length)).toLowerCase();
    name += randomLetter;
  }

  if (!io) {
    io = require('socket.io')(req.connection.server);

    io.sockets.on('connection', function(client) {
      client.on('Client join', function(ime) {
        // When a user joins the chat, add them to the room
        client.join(room);

        db.pool.connect(function(err, client, done) {
          if (err) {
            return res.send(err);
          }
          client.query(`SELECT * FROM chat`, [], function(err, result) {
            done();
            if (err) {
              return res.send(err);
            } else {
              poruke = result.rows;
              console.log("Emitting 'Sve_poruke' event to the client");
              // Retrieve messages from the database and emit them to all users in the room
              io.sockets.to(room).emit("All messages", poruke);
              console.log(poruke);
            }
          });
        });

        onlineUsers[client.id] = ime; // Add the user to the online users object
        console.log(Object.values(onlineUsers));
        io.sockets.to(room).emit('Online users', Object.values(onlineUsers)); // Emit the list of online users to all clients in the room
        client.emit('Entered into the conversation', "You have joined the conversation!"); // Emit a message to the client who joined
        client.broadcast.to(room).emit('Entered into the conversation', ime); // Emit the user's name to other clients in the room

        client.on('disconnect', function() {
          delete onlineUsers[client.id]; // Remove the user from the online users object
          client.broadcast.to(room).emit('Online users', Object.values(onlineUsers)); // Emit the updated list of online users to all clients in the room
          client.broadcast.to(room).emit('Disconnected from the conversation', ime); // Emit an event when a user leaves the conversation
        });
      });

      client.on('Message', function(poruka, ime) {
        db.pool.connect(function(err, client, done) {
          if (err) {
            return res.send(err);
          }
          client.query(`INSERT INTO chat(prouka,ime) 
            VALUES ($1,$2)`, [poruka, ime], function(err, result) {
            done();
            if (err) {
              return res.send(err);
            } else {
              var zadnja = [];
              db.pool.connect(function(err, client, done) {
                if (err) {
                  return res.send(err);
                }

                client.query(`select * from chat order by id desc limit 1`, [], function(err, result) {
                  done();
                  if (err) {
                    return res.send(err);
                  } else {
                    zadnja = result.rows;
                    console.log(zadnja);
                    // Insert the message into the database, fetch it, and emit it to all users in the room
                    io.sockets.in(room).emit("A message to everyone", zadnja);
                  }
                });
              });
            }
          });
        });
      });

      client.on("Private message", function(posiljalac, primaoc) {// private messages, on the frontend, I have an onclick function that sends the sender and recipient, I haven't finished this request yet
        console.log(posiljalac + primaoc);
        room = "private" + primaoc + posiljalac;
        client.join(room);
        client.emit('Entered into a private conversation', "You have joined a private conversation!", primaoc);
        io.to(room).emit('Online private korisnici', Object.values(onlineUsers), primaoc);
      });
    });
  }

  res.render('index', {
    imee: name
  });
});

module.exports = router;
