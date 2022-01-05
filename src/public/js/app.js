const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log('Connected to Server');
});

socket.addEventListener('close', () => {
  console.log('Disconnected to Server');
});

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

function sendMesssage(data) {
  socket.send(data);
}

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  sendMesssage(makeMessage('new_message', input.value));
  input.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  sendMesssage(makeMessage('nickname', input.value));
  input.value = '';
}

messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
