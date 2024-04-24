import fetches from "../api/fetches.js";
import { $boardSection } from "../main.js";
import { room } from './startMGame.js';
import { createRoomMessage } from "./webGameRender.js";

// const chatElement = document.createElement('div');
// chatElement.classList.add('chat');
const colors = ['red','blue','purple','green','yellow','orange','indigo', 'brown','teal','pink']

const renderRoomInfo = (playerNames, room, name, currentWebRoom, messages) => {
  $boardSection.innerHTML= '<img src="./img/azul-box-cover.jpg" style="float:right">';
  createRoomMessage();
  const element = document.createElement('div');
  if (playerNames) {
    element.innerHTML = `
      <h2>Room # ${room} PLAYERS</h2>
      ${playerNames.reduce((total, current) => {
        return total + `<h3 style='color:${colors[Math.floor(Math.random() * colors.length)]}'>${current}</h3>`
      }, '')}
    `
    currentWebRoom = [...playerNames];
  element.classList.add('roomInfo');
  $boardSection.appendChild(element);
  }
  const chatElement = document.createElement('div');
  if (messages) {
    if (!messages.length) chatElement.innerHTML = `<h2>CHAT LOGS</h2>`
    else {chatElement.innerHTML = `
      <h2>CHAT LOGS</h2>
      ${messages.reduce((total, current) => {
        return total + `<h4>${current}</h4>`
      }, '')}
    `}
    console.log(chatElement.innerHTML);
    chatElement.classList.add('chatInfo');
    $boardSection.appendChild(chatElement);
  }
}

const renderInput = () => {
  const element = document.createElement('form');
  element.classList.add('chatForm');
  element.innerHTML = `
    <label for='chatinput'>Chat</label>
    <input type='text' id='chatinput' name='chatinput'>
    <input type='submit' id='submit' value='Send'>
  `;
  element.addEventListener('submit', e => {sendMessage(e, document.querySelector('#chatinput').value)})
  const $header = document.querySelector('header');
  $header.appendChild(element);
}

const sendMessage = async (e, input) => {
  e.preventDefault();
  if (input.length > 500) {
    alert('please limit messages to 500 characters or less');
    document.querySelector('#chatinput').value = '';
    return;
  }
  if (!input.length) {
    return;
  }
  try {
    document.querySelector('#chatinput').value = '';
    await fetches.sendMessage(input, room); /////
  } catch (err) {
    console.log(err);
  }
}
const renderChat = async () => {

}

export { renderRoomInfo, renderChat, renderInput }