const API_URL = ''; // TODO figure this out
import { log } from 'console';

const fetches = {

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