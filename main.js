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

import {startGame} from './src/gameSetup.js';
import {resetState} from './src/gameSetup.js';
import state from './src/state.js';

import {getToken} from './multiplayer/startMGame.js';

/**
 * Setup for needed DOM connections.
 */
const $boardSection = document.querySelector('#boardSection');
const $activePlayerSection = document.querySelector('#playerSection');
let $otherPlayerSections = [];
(function otherSections() {
  for (let i=2; i<5; i++) {
    const $section = document.querySelector(`#player${i}Section`);
    $otherPlayerSections.push($section);
  }
})();

/**
 * Initialize buttons to start and reset game.
 */
(function playButtons() {
  for (let i=2; i<5; i++) {
    document.querySelector(`#start${i}`).addEventListener('click', () => {
      if (!state.gameStart) startGame(i);
    })
  }
  document.querySelector('#reset').addEventListener('click', () => {
    if (state.gameStart) {
      if (confirm('Are you sure you want to quit the current game?')) {
        resetState();
        [...$otherPlayerSections, $activePlayerSection].forEach(section => section.innerHTML = '');
        $boardSection.innerHTML= '<img src="./img/azul-box-cover.jpg">';
      }
    }
  })
})();

getToken();

export {$activePlayerSection, $otherPlayerSections, $boardSection}