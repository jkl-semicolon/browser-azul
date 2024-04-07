import {state} from './../main.js';
import {landingPattern} from './renderPlayerBoard.js';
import startRound from './startRound.js';
import { newRoundOrNawww } from './../main.js';

/**
 * Initializes empty player objects in state.players.
 * @param {number} numberPlayers, the number of players selected
 */
const initializePlayers = (numberPlayers) => {
  for (let i=0; i<numberPlayers; i++) {
    state.players.push({
      name: `Player ${i+1}`,
      score: 0,  // number
      limbo: [], // array of strings for tiles
      staging: [[],[],[],[],[],],  // array of arrays of strings for tiles
      landing:  [[],[],[],[],[],], // array of arrays of strings for tiles
      broken: [], // array of strings for tiles
      firstNext: false, //  boolean for first in turn order next round
    });
  };
};

/**
 * Helps set the factory tile number for the number of players, and adds their arrays to state.
 */
const setFactoryTiles = () => {
  state.factoryTiles = (state.players.length === 2) ? 5 : (state.players.length === 3) ? 7 : 9;
  for (let i=0; i<state.factoryTiles; i++) state.middle.push([]);
};

/**
 * Fisher-Yates Shuffle, sourced from: https://bost.ocks.org/mike/shuffle/.
 * To help randomize players for function setTurnOrder, and for shuffling tiles in bag.
 * @param {array}, array of player objects 
 * @returns {array}, array of shuffled player objects
 */
export const shuffle = (array) => {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  };
  return array;
};

/**
 * Sets player order randomly at the start, then sets player order according to
 * the 1st player marker at the start of subsequent rounds.
 */
export const setPlayerOrder = () => {
  state.turnOrder = shuffle([...state.players]);
  for (let i=0; i<state.turnOrder.length; i++) {
    if (state.turnOrder[i].firstNext) {
      state.turnOrder.unshift(state.turnOrder.splice(i,1)[0]);
      for (const player of state.players) player.firstNext = false;
    };
  };
};

/**
 * Fills 100 tiles of 5 different colors into the grab bag at the start of the game.
 * Uses a row of landing pattern to know which tiles to push.
 */
const fillBag = () => {
  landingPattern[0].forEach(tile => {for (let i=0; i<20; i++) state.bag.push(tile)});
  shuffle(state.bag);
};

/**
 * Occurs upon player selection button press. 
 * Initialize players, set factory tile number, and player order randomly.
 * @param {number} numberPlayers, the number of players selected
 */
const startGame = (numberPlayers) => {
  initializePlayers(numberPlayers);
  setFactoryTiles();
  fillBag();
  newRoundOrNawww();
};

export default startGame;