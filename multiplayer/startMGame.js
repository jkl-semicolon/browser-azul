import fetches from './../api/fetches.js';
import state from './../src/state.js';
import { renderWebPlayers } from '../src/renderPlayerBoard.js';
import { renderWebMainArea } from './webGameRender.js';
import { renderRoomInfo, renderInput } from './renderMulti.js';

let token = '';
let name = '';
let room = null;
let myInter = null;
let webState = {};
let playerIndex = null;
let preInter = null;
let currentWebRoom = [];

const resetWebState = async () => {
  clearInterval(myInter);
  clearInterval(preInter);
  const chatToRemove = document.querySelector('.chatForm');
  if (chatToRemove) chatToRemove.remove();
  token = '';
  name = '';
  room = null;
  myInter = null;
  webState = {};
  playerIndex = null;
  preInter = null;
  currentWebRoom = [];
}

/**
 * getToken is basically Join a Room, where you enter in a name and a game room. TODO: change its name.
 * You get back a token containing your player number, name, and room number.
 * The name must be unique in a room, and rooms can have maximum four people.
 * getToken will be available as a button on the main page. name and room will be stored locally as well.
 * Validation currently done client-side.
 */
const getToken = async () => {
  try {
  // name prompt and validation
  name = prompt('Please Enter Your Name:');
  if (!name) {
    alert('you must enter a name! try again.');
    return;
  }
  // room prompt and validation
  room = prompt('Please Enter a Game Room Number:');
  if (!room) {
    alert('you must enter a room number! try again.');
    return;
  } else if (room < 0) {
    alert('room number must not be negative! try again.');
    return;
  } else if (room > 10000000) {
    alert("we don't have more than 10 million rooms! try again.");
    return;
  } else if (isNaN(Number(room))) {
    alert('please only enter a number! try again.');
    return;
  }
  // test if the room is full, or if someone from that room has your name
  const {chosenRoom} = await fetches.testToken(room);
  if (chosenRoom) {
    if (chosenRoom.players.length >= 4) {
      alert('four players have already joined! try again later.');
      return;
    }
    for (const player of chosenRoom.players) {
      if (name === player) {
        alert('you must enter a unique name from the other players in the room! try again.');
        return;
      }
    }
  }
  // generates token based on name and room // TODO remove
  token = await fetches.getToken(name, room);
  const {chosenRoomAfter} = await fetches.testToken(room);
  renderRoomInfo(chosenRoomAfter?.players, room, name, currentWebRoom, chosenRoomAfter?.messages);
  renderInput();
  preInter = setInterval(preWaiting, 500);
  state.gameStart = true;
  state.waitingReset = true;
  } catch (err) {
    console.log(err);
  }
}

const preWaiting = async () => {
  try {
    const {chosenRoom} = await fetches.testToken(room);
    if (currentWebRoom.slice(1, currentWebRoom.length) === chosenRoom.players) return;
    else currentWebRoom = [...chosenRoom.players];
    renderRoomInfo(chosenRoom?.players, room, name, currentWebRoom, chosenRoom.messages);
  } catch (err) {
    console.log(err);
  }
}

/**
 * waitingStart will be a button that appears on the main page ONLY if the player
 * has a token. It first tests if that room has at least two players, if so, the player
 * can choose to be ready to start the game. An array of booleans matching the player number
 * server side will have one boolean flipped to true. Next, an interval every half second
 * is set for nowWaiting to poll the server.
 */
const waitingStart = async () => {
  try {
    const {chosenRoom} = await fetches.testToken(room);
    if (chosenRoom.players.length < 2) {
      alert('two players minimum are required to start! try again later.');
      return;
    }
    await fetches.setStart(true, token, room);
    myInter = setInterval(nowWaiting, 500)
    state.waitingStart = true;
  } catch (err) {
    console.log(err);
  }
}

/**
 * nowWaiting primarily polls the server to see if the array of booleans for the room all turn to true.
 * If so, the server will send a set up state object over to the player.
 */
const nowWaiting = async () => {
  try {
    const response = await fetches.waitStart(room);
    if (!response) return;
    clearInterval(preInter);
    clearInterval(myInter);
    const chatToRemove = document.querySelector('.chatForm');
    if (chatToRemove) chatToRemove.remove();
    webState = response;
    playerIndex = determineIndex(webState);
    stateUpdated();
    setTimeout(() => {clearInterval(myInter); stateUpdated()}, 550); // for bug fix
  } catch (err) {
    console.log(err);
  }
}

/**
 * Helper function to determine a player's index (may be redundant, but something to fix in the future)
 * and saves it as a globally scoped variable for easy access.
 * @param {object}, webState is the current state object of the multiplayer game occurring.
 * @returns {number}, the index of the player in the webState.players array.
 */
const determineIndex = (webState) => {
  for (let i=0; i<webState.players.length; i++) {
    if (webState.players[i].name === name) return i;
  }
}

/**
 * nowWaiting primarily polls the server to see if the array of booleans for the room all turn to true.
 * If so, the server will send a set up state object over to the player.
 */
const waitingAgain = async () => {
  try {
    const response = await fetches.waitStart(room);
    if (JSON.stringify(response) === JSON.stringify(webState)) return; // if poll shows the state has not changed, keep polling
    clearInterval(myInter);
    webState = response;
    stateUpdated();
  } catch (err) {
    console.log(err);
  }
}

const stateUpdated = () => {
  renderWebPlayers(webState);
  renderWebMainArea(webState);
  if (webState.winner) {
    alert(`🎉🎉🎉 CONGRATULATIONS TO ${webState.winner}, THE WINNER OF OUR GAME! 🎉🎉🎉`);
    token = '';
    name = '';
    room = null;
    myInter = null;
    webState = {};
    playerIndex = null;
    state.gameStart = true;
  }
  if (webState.turnOrder[webState.currentPlayer].name !== name) myInter = setInterval(waitingAgain, 500);
} // if not our turn, poll the server again

const nextTurn = async () => {
  await fetches.sendStateAfterTurn(webState, room);
  myInter = setInterval(waitingAgain, 500);

}

const testServerFunc = async () => {
  const response = await fetches.testServer();
  if (response === 'hello') {
    state.serverSuccess = true;
    const button = document.querySelector('#testServer');
    button.setAttribute('style', 'background-color:green');
    setTimeout(() => {button.setAttribute('style','background-color:red'); state.serverSuccess = false}, 900000)
  }
}

export {getToken, waitingStart, nowWaiting, token, name, room, webState, nextTurn, resetWebState, testServerFunc };