import {takeTurn} from './gameFlow.js';
import {shuffle} from './gameSetup.js';
import {renderMainArea} from './renderMainArea.js';
import state from './state.js';

/**
 * Sets player order randomly at the start of the first round, then sets 
 * player order according to the 1st player marker at the start of subsequent rounds.
 */
const setPlayerOrder = () => {
  state.turnOrder = shuffle([...state.players]);
  for (let i=0; i<state.turnOrder.length; i++) {
    if (state.turnOrder[i].firstNext) {
      state.turnOrder.unshift(state.turnOrder.splice(i,1)[0]);
      for (const player of state.players) player.firstNext = false;
    };
  };
};

/**
 * Occurs at the start of a new round; adds four tiles from the bag to
 * each factory tile in the middle. Shuffles discard into bag if 
 * there are not enough tiles in the bag. If still not enough, leave rest empty.
 */
const popFacTiles = () => {
  for (let i=1; i<=state.factoryTiles; i++) {
    for (let j=0; j<4; j++) {
      if ((state.bag.length === 0) && (state.discard.length === 0)) return;
      if (state.bag.length === 0) {
        state.discard.forEach(tile => state.bag.push(tile));
        state.discard = [];
        shuffle(state.bag);
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
 * and place 1st player tile in the middle. Render the main area, set player order,
 * set the round's turn tracker to 0, and start the turn of the first player
 * in the round.
 */
const startRound = () => {
  popFacTiles();
  placeFirstTile();
  renderMainArea();
  setPlayerOrder();
  state.turnCounter = 0;
  takeTurn();
};

export {startRound};