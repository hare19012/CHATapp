var express = require('express');
var router = express.Router();
var  db = require("../konekcija.js");
var io;
/* GET home page. */
router.get('/', function(req, res, next) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var name = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

  for (var i = 0; i < 7; i++) {
    var randomLetter = alphabet.charAt(Math.floor(Math.random() * alphabet.length)).toLowerCase();
    name += randomLetter;
  }
  let onlineKorisnici = {};
  if (!io) {
    io = require('socket.io')(req.connection.server);
    io.sockets.on('connection', function (client) {
      client.on('Joino se klijent', function (ime) {
        client.join("123");
        onlineKorisnici[client.id] = ime; // Dodajte korisnika u objekat online korisnika
        io.sockets.to("123").emit('Online korisnici', Object.values(onlineKorisnici)); // Emitujte listu online korisnika svim klijentima u sobi
        client.emit('USAO_U_RAZGOVOR', "Pridružili ste se chatu"); // Emitujte poruku samo klijentu koji se povezao
        client.broadcast.to("123").emit('USAO_U_RAZGOVOR', ime); // Emitujte ime korisnika drugim klijentima u sobi
        client.on('disconnect', function () {
          delete onlineKorisnici[client.id]; // Uklonite korisnika iz objekta online korisnika
          io.sockets.to("123").emit('Online korisnici', Object.values(onlineKorisnici)); // Emitujte ažuriranu listu online korisnika svim klijentima u sobi
          client.broadcast.to("123").emit('IZASAO_IZ_RAZGOVORA', ime); // Emitujte događaj kada korisnik napusti razgovor
        });
      });

    });
  }
  res.render('index', { kod:'123',imee:name});
});

module.exports = router;
