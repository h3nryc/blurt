var express = require('express');
var app = express();
var path = require('path');
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var Datastore = require('nedb')
, userDB = new Datastore({ filename: './db/users.json', autoload: true });
eventDB = new Datastore({ filename: './db/event.json', autoload: true });

app.use('/', express.static(path.join(__dirname, 'Frontend')))

//Connection from server
io.on('connection', function(socket){

  //Add Events and send out invites
  socket.on('newEvent', function(data,type){
    for (var i = 0; i < data.friendId.length; i++) {

      if (type = 0) {
        var eventDoc = {
          inEvent: data.friendId,
          unix: new Date().getTime(),
          time: data.time,
          verb: data.verb,
          locIn: [data.addressNick]
        }

        //Insert Event into Db
        eventDB.insert(eventDoc, function (err, newDoc) {
          if(err){console.log(err);}
          socket.emit('eventSuc')
          //Push event _id into users array of events.
          for (var i = 0; i < data.friendId.length; i++) {
            userDB.update({ _id: data.friendId[i] }, { $push: { events: newDoc._id } }, {}, function () {
            });
          }
        });
      }else {
        var eventDoc = {
          inEvent: data.friendId,
          unix: new Date().getTime(),
          time: data.time,
          verb: data.verb,
          locIn: [data.addressNick, data.address]
        }

        eventDB.insert(eventDoc, function (err, newDoc) {
          if(err){console.log(err);}
          socket.emit('eventSuc')
          for (var i = 0; i < data.friendId.length; i++) {
            userDB.update({ _id: data.friendId[i] }, { $push: { events: newDoc._id } }, {}, function () {
            });
          }
        });

      }

    }
  });
});
