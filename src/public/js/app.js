const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('#enter');

const room = document.getElementById('room');
const h3 = room.querySelector('h3');
room.hidden = true;

let roomName = '';

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('input');
  const value = input.value;
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = '';
}

function updateCount(count = 1) {
  h3.innerHTML = `Room: ${roomName} (${count})`;
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  updateCount();
  const msgForm = room.querySelector('#msg');
  msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const nicknameInput = form.querySelector('input[name="nickname"]');
  const roomInput = form.querySelector('input[name="room"]');
  roomName = roomInput.value;
  socket.emit('nickname', nicknameInput.value);
  socket.emit('enter_room', roomInput.value, showRoom);
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, newCount) => {
  updateCount(newCount);
  addMessage(`${user} arrived!`);
});

socket.on('bye', (user, newCount) => {
  updateCount(newCount);
  addMessage(`${user} left!`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    roomList.innerHTML = '';
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});
