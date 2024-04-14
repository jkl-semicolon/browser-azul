import fetches from './../api/fetches.js';

let token = '';

//button for getToken is in the header
const getToken = async () => {
  try {
  const name = prompt('Please Enter a Name:');
  if (!name) {
    alert('you must enter a name! try again.');
    return;
  }

  const room = prompt('Please Enter a Game Room:');
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

  const currGame = await fetches.testToken(room);
  console.log('currGame:', currGame);
  if (currGame) {
    if (currGame.players.length >= 4) {
      alert('four players have already joined! try again later.');
      return;
    }
    for (const player of currGame.players) {
      if (name === player) {
        alert('you must enter a unique name from the other players! try again.');
        return;
      }
    }
  }

  token = await fetches.getToken(name, room);
  console.log(token);

  } catch (err) {
    console.log(err);
  }
}

// button for this only appears when player has a token
const waitingStart = async () => {
  try {
    await fetches.setStart(true, token);
  } catch (err) {
    console.log(err);
  }
}

export {getToken, waitingStart };