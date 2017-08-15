var PlayerModule = require('./public/Player.js');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var server  = app.listen(port, function(){
  console.log('Our app is running on http://localhost:' + port);
});
var io = require('socket.io')(server);


app.get('/', function(req, res){
  res.sendfile('public/game.html');
});
//app.use('/', express.static('public'));
app.use(express.static(__dirname + '/public'));

var players = {};

io.on('connection', function(socket){
    console.log('new user: ' + socket.id);

    socket.on('createPlayer', function(playerInfo) {
        //var player = new PlayerModule.Player(socket.id, playerInfo[0], false, Math.random()*3000, Math.random()*1500, '#'+Math.floor(Math.random()*16777215).toString(16), playerInfo[1]);
        players[socket.id] = {id: socket.id, x:48, y:258};
        socket.emit('init', players[socket.id]);
        socket.emit('allplayers', players);
        io.sockets.emit('newPlayer', players[socket.id]);
    });

    socket.on('disconnect', function(){
      console.log('user disconnected: ' + socket.id);
      delete players[socket.id];
      io.sockets.emit('playerQuit', socket.id);
    });

    socket.on('currentPosition', function(player){
        //console.log(player.id + ": " + player.x + " " + player.y);
        if(players[socket.id] != undefined) {
            players[socket.id] = player;
        }
    });

});

var prevTime = (new Date()).getTime();
function gameloop() {

    /*var currentTime = (new Date()).getTime();
    var dt = currentTime - prevTime;
    prevTime = currentTime;
*/
    io.sockets.emit('updatePositions', players);
    setTimeout(gameloop, 1000/20);
}

gameloop();