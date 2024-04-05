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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// startGame(4); ////////////////////////////////////////////////////////////////////////////////////////////////
// console.log(state);
// state.players[2].staging[0].push('yellow');
// state.players[2].staging[1].push('green','green');
// state.players[2].staging[2].push('red');
// state.players[2].staging[3].push('blue','blue','blue');
// state.players[2].staging[4].push('yellow');
// state.players[2].landing[0].push();
// state.players[2].landing[1].push('yellow','red');
// state.players[2].landing[2].push('blue','yellow','purple');
// state.players[2].landing[3].push('green','purple');
// state.players[2].landing[4].push('green','purple','blue');
// state.players[2].broken.push('green','red','purple','purple');
// state.players[2].limbo.push('yellow','yellow','yellow');
// console.log(state);
// state.middle[1].push('green','yellow','yellow','red');
// state.middle[2].push('green','yellow','blue','blue');
// state.middle[3].push('blue','blue','blue','green');
// state.middle[4].push('purple','yellow','yellow','red');
// state.middle[6].push('purple','green','red','blue');
// state.middle[8].push('green','red','green','red');
// state.middle[9].push('purple','blue');
// state.middle[0].push('first','green','yellow','yellow','red','blue','blue','blue','green','yellow','yellow','yellow');
// console.log(state.middle);
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// $playerSection.appendChild(renderPlayerBoard(state.players[2]));
// console.log(state.players[2]);

// // console.log(createMiddleArea());

// $boardSection.appendChild(renderMainArea());
// $boardSection.appendChild(createMiddleArea());
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
 * 
 */
export const endGameScoring = () => {
  console.log('hello, i am end game scoring');
};



const playRound = () => {
  console.log('start round')

  let midHasTiles = true;
  
  const checkMid = () => {
    midHasTiles = false;
    state.middle.forEach((part) => {
      if (part.length) midHasTiles = true;
    })
  }

  
}

const playGame = (numPlayers) => {
  startGame(numPlayers);
  // if end game condition: go to end game scoring
  // else:
  startRound();
  setPlayerOrder();
  playRound();
  endRoundScoring();
};


startGame(4);
state.currentPlayer = 2;
// state.middle[0].push('red')
state.players[2].staging[3].push('red');
state.players[2].staging[4].push('blue', 'blue')
state.players[2].landing[3].push('red');
state.players[2].landing[2].push('red');
startRound();
renderPlayerBoard(state.players[2], $playerSection)
renderPlayerBoard(state.players[0], $player2Section)
renderPlayerBoard(state.players[1], $player3Section)
renderPlayerBoard(state.players[3], $player4Section)
renderMainArea();
state.activeGrab = true;
console.log(state.bag);
// playRound()