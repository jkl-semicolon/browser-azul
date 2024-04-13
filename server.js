import express from 'express';
// import { log } from 'console';

import state from './src/state.js';

const startServer = async () => {
  const api = express();
  const PORT = 8000;

  api.use(express.json());
  api.use(express.urlencoded({extended: true}));

  api.get('/', async (req, res) => {
    try {
      res.send(state);
    } catch (err) {
      log(err);
    }
  });

  // const updateState = () => {
  //   state = 
  // }

  api.put('/', async (req, res) => {
    try {
      updateState(req.body);
      res.send(state);   // perhaps we need to update all of the individual user states
    } catch (err) {
      log(err);
    }
  })
  api.listen(PORT, () => log('Listening on port ' + PORT + ', over.'))
}

export default startServer;



