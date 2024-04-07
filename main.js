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
import { landingPattern } from './src/renderPlayerBoard.js';

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
 * Occurs either at the end of a round start, or if another turn is
 * determined to be needed. Switches the current player, renders
 * player boards in correct positions, and turns on first event 
 * listener for the active player.
 */
export const takeTurn = () => {

  state.currentPlayer = state.turnCounter % state.turnOrder.length
  state.turnCounter++;

  let p2Empty = true;
  let p3Empty = true;
  for (const player of state.turnOrder) {
    const index = state.turnOrder.indexOf(player);
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



// state.players.push({
//   name: `Player ${i+1}`,
//   score: 0,  // number
//   limbo: [], // array of strings for tiles
//   staging: [[],[],[],[],[],],  // array of arrays of strings for tiles
//   landing:  [[],[],[],[],[],], // array of arrays of strings for tiles
//   broken: [], // array of strings for tiles
//   firstNext: false, //  boolean for first in turn order next round
// });

// export const landingPattern = [
//   ['blue','yellow','red','purple','green'],
//   ['green','blue','yellow','red','purple'],
//   ['purple','green','blue','yellow','red'],
//   ['red','purple','green','blue','yellow'],
//   ['yellow','red','purple','green','blue'],
// ];

const endRoundScoring = () => {

  state.players.forEach((player) => { 
    player.staging.forEach((row, i) => {

      if (row.length === i + 1) {
        const scoredTile = row[0];
        player.landing[i].push(row.shift());
        while (row[0]) state.discard.push(row.pop());
        const scoredIndex = landingPattern[i].indexOf(scoredTile);

        let hScore = 0;
        for (let j=scoredIndex; j<4; j++) {
          if (player.landing[i].indexOf(landingPattern[i][j+1]) !== -1) hScore++;
          else break;
        }
        for (let j=scoredIndex; j>0; j--) {
          if (player.landing[i].indexOf(landingPattern[i][j-1]) !== -1) hScore++;
          else break;
        }
        if (hScore !== 0) hScore++;

        let vScore = 0;
        for (let j=i; j<4; j++) {
          if (player.landing[j+1].indexOf(landingPattern[j+1][scoredIndex]) !== -1) vScore++;
          else break;
        }
        for (let j=i; j>0; j--) {
          if (player.landing[j-1].indexOf(landingPattern[j-1][scoredIndex]) !== -1) vScore++;
          else break;
        }
        if (vScore !== 0) vScore++;

        let earnedScore = hScore + vScore;
        if (earnedScore === 0) earnedScore++;
        player.score += earnedScore;
      }
    });
  });
  renderPlayerBoard(state.players[0],$playerSection);
  renderPlayerBoard(state.players[1],$player2Section);
};


/**
 * Occurs at the end of the second event handler of a player's turn. 
 * Checks to see if another turn in the round is needed, and either a new
 * turn occurs or end round scoring occurs.
 */
export const newTurnOrNawww = () => {
  let midHasTiles;
  state.middle.forEach((part) => {
    if (part.length) midHasTiles = true;
  });
  if (midHasTiles) takeTurn();
  else endRoundScoring();
};

startGame(2);