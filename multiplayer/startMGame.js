import fetches from './../api/fetches.js';
import state from './../src/state.js';

let token = '';
let name = '';
let room = null;
let myInter = null;

//button for getToken is in the header
const getToken = async () => {
  try {
  name = prompt('Please Enter a Name:');
  if (!name) {
    alert('you must enter a name! try again.');
    return;
  }

  room = prompt('Please Enter a Game Room:');
  if (!room) {
    alert('you must enter a room number! try again.');
    return;
  } else if (room < 0) {
    alert('room number must not be negative! try again.');
    return;
  } else if (isNaN(Number(room))) {
    alert('please only enter a number! try again.');
    return;
  }

  const {chosenRoom} = await fetches.testToken(room);
  console.log('PROBLEM HERE:', chosenRoom)
  if (chosenRoom) {
    if (chosenRoom.players.length >= 4) {
      alert('four players have already joined! try again later.');
      return;
    }
    for (const player of chosenRoom.players) {
      if (name === player) {
        alert('you must enter a unique name from the other players! try again.');
        return;
      }
    }
  }

  token = await fetches.getToken(name, room);

  } catch (err) {
    console.log(err);
  }
}

// button for this only appears when player has a token
const waitingStart = async () => {
  try {
    const {chosenRoom} = await fetches.testToken(room);
    console.log(chosenRoom);
    if (chosenRoom.players.length < 2) {
      alert('two players minimum are required to start! try again later.');
      return;
    }
    await fetches.setStart(true, token, room);
    myInter = setInterval(nowWaiting, 500)
  } catch (err) {
    console.log(err);
  }
}

const nowWaiting = async () => {
  try {
    const response = await fetches.waitStart(room);
    console.log('response:', response)
    if (!response) return;
    console.log('successful response:', response);
    return response;
  } catch (err) {
    console.log(err);
  }
}

export {getToken, waitingStart, nowWaiting };