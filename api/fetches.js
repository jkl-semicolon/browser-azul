const API_URL = 'https://browser-azul-server.onrender.com';
const log = console.log;

const fetches = {

  testToken: async (room) => {
    try {
      const response = await fetch(API_URL + '/testToken', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({room})
      });
      const chosenRoom = await response.json();
      return chosenRoom;
    } catch (err) {
      log(err);
    }
  },
  getToken: async (name, room) => {
    try {
      const response = await fetch(API_URL + '/getToken', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, room})
      })
      const json = await response.json();
      return json;
    } catch (err) {
      log('error getting token to play!', err);
    }
  },

  setStart: async (start, token, room) => {
    try {
      await fetch(API_URL + '/setStart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({start, token, room})
      })
    } catch (err) {
      log('error starting game!', err);
    }
  },

  waitStart: async (room) => {
    try {
      const response = await fetch(API_URL + '/waitStart/' + room);
      const json = await response.json();
      if (json === 'egg') return; // don't change without changing server side
      return json;
    } catch (err) {
      log('error waiting for game start!', err);
    }
  },

  sendStateAfterTurn: async (state, room) => {
    try {
      await fetch((API_URL + '/setStateAfterTurn/' + room), {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({state})
      })
    } catch (err) {
      log('error sending state after turn!', err);
    }
  },

  getState: async () => {
    try {
      const response = await fetch(API_URL)
      const json = await response.json();
      return json;
    } catch (err) {
      log('error getting state!', err);
    }
  },

  updateState: async (state) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({state})
      })
      const json = await response.json();
      return json;
    } catch (err) {
      log('error updating state!', err);
    }
  }
}

export default fetches;