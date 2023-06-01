var express = require('express');
var router = express.Router();
var redis = require('redis');
var  db = require("../konekcija.js");
var io;
var redisClient = redis.createClient();
/* GET home page. */
let onlineKorisnici = {};
router.get('/', function(req, res, next) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var poruke = [];
  var name = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

  for (var i = 0; i < 7; i++) {
    var randomLetter = alphabet.charAt(Math.floor(Math.random() * alphabet.length)).toLowerCase();
    name += randomLetter;
  }
  if (!io) {
    io = require('socket.io')(req.connection.server);
    io.sockets.on('connection', function (client) {
      client.on('Joino se klijent', function (ime) {
        client.join("123");
        db.pool.connect(function (err, client, done) {
          if (err) {
            return res.send(err);
          }
          client.query(`SELECT * FROM chat`, [], function (err, result) {
            done();
            if (err) {
              return res.send(err);
            } else {
              poruke = result.rows;
              console.log("Emitting 'Sve_poruke' event to the client");
              io.sockets.to("123").emit("Sve_poruke",poruke);
              console.log(poruke);




            }

          });
        });
        onlineKorisnici[client.id] = ime; // Dodajte korisnika u objekat online korisnika
        console.log(Object.values(onlineKorisnici));
        io.sockets.to("123").emit('Online korisnici', Object.values(onlineKorisnici)); // Emitujte listu online korisnika svim klijentima u sobi
        client.emit('USAO_U_RAZGOVOR', "You have joined the conversation!"); // Emitujte poruku samo klijentu koji se povezao
        client.broadcast.to("123").emit('USAO_U_RAZGOVOR', ime); // Emitujte ime korisnika drugim klijentima u sobi


        client.on('disconnect', function () {
          delete onlineKorisnici[client.id]; // Uklonite korisnika iz objekta online korisnika
          client.broadcast.to("123").emit('Online korisnici', Object.values(onlineKorisnici)); // Emitujte ažuriranu listu online korisnika svim klijentima u sobi
          client.broadcast.to("123").emit('IZASAO_IZ_RAZGOVORA', ime); // Emitujte događaj kada korisnik napusti razgovor
        });
      });
      client.on('Salje poruku',function (poruka,ime){
        db.pool.connect(function (err, client, done) {
          if (err) {
            return res.send(err);
          }
          client.query(`INSERT INTO chat(prouka,ime) 
            VALUES ($1,$2)`, [poruka,ime], function (err, result) {
            done();
            if (err) {
              return res.send(err);
            } else {
              var zadnja = [];
              db.pool.connect(function (err, client, done) {
                if (err) {
                  return res.send(err);
                }


                client.query(`select * from chat order by id desc limit 1`, [], function (err, result) {
                  done();
                  if (err) {
                    return res.send(err);

                  } else {
                    zadnja = result.rows;
                    console.log(zadnja);
                    io.sockets.in("123").emit("Svima poruka",zadnja);

                  }

                });
              });


            }

          });
        });
      });

    });
  }
  res.render('index', { kod:'123',imee:name});
});

module.exports = router;
