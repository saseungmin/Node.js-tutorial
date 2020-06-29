var socket = io.connect('http://localhost:8005/chat', {
    path:'/socket.io'
});

socket.on('join', function(data) {
    var div = document.createElement('div');
    div.classList.add('system');
    var chat = document.createElement('div');
    div.textContent = data.chat;
    div.appendChild(chat);
    document.querySelector('#chat-list').appendChild(div);
});

socket.on('exit', function(data){
    var div = document.createElement('div');
    div.classList.add('system');
    var chat = document.createElement('div');
    div.textContent = data.chat;
    div.appendChild(chat);
    document.querySelector('#chat-list').appendChild(div);
})