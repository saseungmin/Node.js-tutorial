socket.on('chat', function (data) {
  var div = document.createElement('div');
  // 현재 채팅치는 사람과 같으면
  if (data.user === '#{user}') {
    div.classList.add('mine');
  } else {
    div.classList.add('other');
  }

  var name = document.createElement('div');
  name.textContent = data.user;
  div.appendChild(name);
  if (data.chat) {
    var chat = document.createElement('div');
    chat.textContent = data.chat;
    div.appendChild(chat);
  } else {
    var gif = document.createElement('img');
    gif.src = '/gif/' + data.gif;
    div.appendChild(gif);
  }
  div.style.color = data.user;
  document.querySelector('#chat-list').appendChild(div);
});

document.querySelector('#chat-form').addEventListener('submit', function (e) {
  e.preventDefault();
  if (e.target.chat.value) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        e.target.chat.value = '';
      } else {
        console.error(xhr.responseText);
      }
    };
    xhr.open('POST', '/room/#{room._id}/chat');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ chat: this.chat.value }));
  }
});
