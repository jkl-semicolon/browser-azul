/**
 * &&&&&&&&&&&&&&&&&&&&       Web Browser Azul        &&&&&&&&&&&&&&&&&&&&
 * 
 * Simulates the popular board game Azul in your web browser.
 * BoardGameGeek entry: https://boardgamegeek.com/boardgame/230802/azul
 * 
 * - Single webpage play for 2-4 players in a hotseat format.
 * - Multiple webpage play for 2-4 players; requires a player to host an API for game state.
 * - Header will contain buttons to start a 2-4 person hotseat game,
 *   or to start a 2-4 person multiple webpage game. Header will also
 *   contain a link to the rules and a reset button for the game.
 * 
 * UI Mock-up: https://excalidraw.com/#json=5A1Qs7M1Xwagbi-VdDQzO,4UbnZ3Pjpiu9dvg4_5PQuQ
 * Playerboard UI Mock-Up: https://excalidraw.com/#json=N80qGXgrPmSGdjNmtWmk8,BZgB_39jdjk9AwewcHqKRA
 * 
*/

/**
 *          #############################################
 *          ## --------------- Imports --------------- ##
 *          #############################################
 * 
 */

import startGame from './src/startGame.js';
import renderPlayerBoard from './src/renderPlayerBoard.js';
import renderMainArea from './src/renderMainArea.js';
import startRound from './src/startRound.js';
import { setPlayerOrder } from './src/startGame.js';

/**
 *          #############################################
 *          ## ---------- Game State Object ---------- ##
 *          #############################################
 */

export const state = {

  gameStart: false, // boolean
  numberPlayers: 0, // enumerated number, either 2, 3, or 4
  factoryTiles: 0, // enumerated number, either 5, 7, or 9
  turnOrder: [],  // array of numbers for players' indexes

  activeGrab: false, // boolean of whether or not middle tile event listeners are active or not.
  activeStaging: false, // boolean of whether it is time to place in staging area or not

  bag: [],  // array of strings for tiles
  discard: [],  // array of strings for tiles
  middle: [[],],  //  array of arrays, with state.middle[0] being the middle area, and 
               //  state.middle[1] being factory tile 1, and so on. The other factory
               // tile empty arrays will be added when the number of players is chosen.
  players: [],  // array of up to 4 player objects; see function initializePlayers
  currentPlayer: 0,  // number of player's index
  turnCounter: 0, // number of the turn in a given round
  gameEnd: false, // boolean
  winner: 0, // number of player's index
};

/**
 *          #############################################
 *          ## ----------- DOM Connections ----------- ##
 *          #############################################
 */
const $player2Section = document.querySelector('#player2Section');
const $player3Section = document.querySelector('#player3Section');
const $player4Section = document.querySelector('#player4Section');
const $otherPlayerSections = [$player2Section, $player3Section, $player4Section]
export const $boardSection = document.querySelector('#boardSection');
export const $playerSection = document.querySelector('#playerSection');

/**
 *          #############################################
 *          ## -------- Global Event Listeners ------- ##
 *          #############################################
 * 
 * //TODO
 * 
 */

/**
 *          #############################################
 *          ## ----------- Game Functions ------------ ##
 *          #############################################
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// state.players[2].landing[0].push();
// state.players[2].landing[1].push('yellow','red');
// state.players[2].landing[2].push('blue','yellow','purple');
// state.players[2].landing[3].push('green','purple');
// state.players[2].landing[4].push('green','purple','blue');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Checks if the end game condition of a player finishing a row in their landing area.
 * If so, game proceeds to end game scoring. Otherwise, start another round.
 */
export const newRoundOrNawww = () => {
  for (const player of state.players) {
    for (const playerLandingRow of player.landing) {
      if (playerLandingRow.length === 5) {
        endGameScoring();
        return;
      }
    }
  }
  startRound();
}

/**
 * 
 *  TODO///
 */
export const endGameScoring = () => {
  console.log('hello, i am end game scoring');
};

/**
 * Occurs either at the end of a round start, or at the end of another player's turn. 
 *  TODO///
 */
export const takeTurn = () => {
  console.log('hello, i am takeTurn');
  console.log(state.turnOrder)
  state.currentPlayer = state.turnCounter % state.turnOrder.length
  state.turnCounter++;

  let p2Empty = true;
  let p3Empty = true;
  for (const player of state.turnOrder) {
    const index = state.turnOrder.indexOf(player);
    console.log ('index', index)
    console.log('state.currentPlayer,', state.currentPlayer)
    if (index === state.currentPlayer) {
      renderPlayerBoard(player, $playerSection);
    } else if (p2Empty) {
      renderPlayerBoard(player, $player2Section);
      p2Empty = false;
    } else if (p3Empty) {
      renderPlayerBoard(player, $player3Section);
      p3Empty = false;
    } else {
      renderPlayerBoard(player, $player4Section);
    }
  }
  state.activeGrab = true;
};


/**
 *  TODO///
 * 
 */
const endRoundScoring = () => {
  console.log('you have reached end of round scoring, congrats!')
};

/**
 *  TODO///
 * 
 */
export const newTurnOrNawww = () => {
  let midHasTiles;
  state.middle.forEach((part) => {
    if (part.length) midHasTiles = true;
  })
  if (midHasTiles) takeTurn();
  else endRoundScoring();
};

startGame(4);
console.log(state.bag);