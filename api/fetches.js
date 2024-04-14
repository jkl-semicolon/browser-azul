const API_URL = 'http://localhost:8000'; // placeholder
const log = console.log;

const fetches = {

  // testGet: async () => {
  //   try {
  //     const response = await fetch(API_URL + '/test', {
  //       // headers: {'Access-Control-Allow-Origin': '*'}
  //     });
  //     const json = await response.json();
  //     console.log(response);
  //     console.log(json);
  //     return json;
  //   } catch (err) {
  //     log('error testing!', err);
  //   }
  // },

  getToken: async (name) => {
    try {
      const response = await fetch(API_URL + '/getToken', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
      });
      console.log(response);
      console.log(response.body);
      const thing = await response.json();
      console.log(thing)
      return thing
    } catch (err) {
      log('error getting token to play!', err);
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