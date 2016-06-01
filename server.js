var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var staticServer = require('express-static');
var total = 0;

app.use(staticServer('./'));
app.get('/',function(req,res){
    res.render('index');
});
http.listen(8068,function(){
    console.log("Sever has been listened at port 8068");
});
io.on("connection",function(socket){
    console.log("some on connected");
    socket.on('join',function(name){
        socket.nickname = name;
        total++;
        console.log(name+"joined");
        socket.broadcast.emit('announcement',name+' joined in');
        socket.emit('backData',name+". You have successfully joined in the chat home,and here are <span>"+total+'</span>  people');
        socket.on('text',function(msg){
            socket.broadcast.emit('text','<span>'+name+'</span>'+':'+msg);
        });
        socket.on('disconnection',function(){
            total--;
            console.log('hi,leave');
            socket.broadcast.emit('announcement',name+' leved away');
            socket.emit('backData',name+". You have successfully joined in the chat home,and here are <span>"+total+'</span>  people');
        });

    });
});
