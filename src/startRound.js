import {state} from './../main.js';
import {shuffle} from './startGame.js';

/**
 * 
 * 
 */
const popFacTiles = () => {
  for (let i=1; i<=state.factoryTiles; i++) {
    for (let j=0; j<4; j++) {
      if ((state.bag.length === 0) && (state.discard.length === 0)) return;
      if (state.bag.length === 0) {
        state.discard.forEach(tile => state.bag.push(tile));
        state.discard = [];
      };
      state.middle[i].push(state.bag.pop());
    };
  };
};


/**
 * Places 1st player tile in middle of table.
 */
const placeFirstTile = () => state.middle[0].push('first');

/**
 * Occurs at the start of each round. Place four tiles on each factory tile
 * and place 1st player tile in the middle.
 */
const startRound = () => {
  popFacTiles();
  placeFirstTile();
};

export default startRound;