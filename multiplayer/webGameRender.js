import {$boardSection} from './../main.js';
import {grabMiddle} from './../src/eventListeners.js';
import { grabWebMiddle } from './webEventListeners.js';
import { name } from './startMGame.js';

/**
 * Occurs at the start of a new round, and also occurs anytime a user input in the game happens. 
 * Creates the factory tiles and possible tiles on those factory tiles depending on their state.
 * Adds an event listener to each tile, which are only active if it is time
 * for a player to take tiles from the middle.
 * @returns {object}, the factory tiles with possible tiles on them.
 */
const createWebFactoryTiles = (state) => {
  const element = document.createElement('div');
  element.classList.add('factoryTileArea');
  for (let i=1; i<=state.factoryTiles; i++) {
    const factoryTile = document.createElement('div');
    factoryTile.classList.add('factoryTile');
    const numHidden = 4 - state.middle[i].length;
    for (let j=0; j<numHidden; j++) {
      const tileSpace = document.createElement('div');
      tileSpace.classList.add('tile', 'hiddenTile');
      factoryTile.appendChild(tileSpace);
    };
    for (let j=0; j<state.middle[i].length; j++) {
      const tile = document.createElement('div');
      tile.classList.add(`${state.middle[i][j]}`,'tile');
      tile.id = i;
      tile.addEventListener('click', () => {grabWebMiddle(Number(tile.id), tile.classList[0])});
      factoryTile.appendChild(tile);
    };
    element.appendChild(factoryTile);
  };
  return element;
};

/**
 * Creates a set of cursory instructions for the active player's turn.
 * Appends to the main area of the board section.
 * @param {object}, the player to render the instructions for
 */
const createWebInstructions = (state) => { ///////////////////////////////////////////////////////////////////////////////////////////////
  const element = document.createElement('div');
  element.classList.add('floating', 'instructions');
  if (state.activeGrab) {
    element.innerHTML = `
      It is ${name}'s turn. Please choose tiles of the same color
      from either one of factory tiles in the middle, or the middle area
      under the factory tiles. Afterwards, choose a row on your playerboard 
      to place your tiles. If you wish, you may also choose the broken tile area.
    `;
  }
  if (state.activeStaging) {
    element.innerHTML = `
    Now, please choose a row to place your tiles. If you wish, you may also
    choose the broken tile area.
    `
  }
  $boardSection.appendChild(element);
}

/**
 * Occurs at the start of a new round, and also occurs anytime a user input in the game happens. 
 * Creates the middle area that can hold an indefinite amount of tiles.
 * Adds an event listener to each tile (except first player tile), which are only active if it is time
 * for a player to take tiles from the middle.
 * @returns {object}, the middle area with possible tiles inside
 */
const createWebMiddleArea = (state) => {
  const element = document.createElement('div');
  element.classList.add('middleArea');
  for (const tile of state.middle[0]) {
    if (tile !== 'first') {
      const midTile = document.createElement('div');
      midTile.classList.add(`${tile}`, 'tile');
      midTile.id = 0;
      midTile.addEventListener('click', () => {grabWebMiddle(Number(midTile.id), midTile.classList[0])});
      element.appendChild(midTile);
    } else {
      const midTile = document.createElement('img');
      midTile.classList.add(`${tile}`, 'tile');
      element.appendChild(midTile);
    }
  }
  return element;
}

/**
 * Renders the main area along with its factory tiles, 1st player tile, and colored tiles.
 */
const renderWebMainArea = (state) => {
  $boardSection.innerHTML = '';
  // console.log('STATE IN CREATE WEB FACTORY TILES', state)
  const element = document.createElement('div');
  // const webFac = createWebFactoryTiles(state)
  // const webMid = createWebMiddleArea(state)
  // element.appendChild(webFac);
  // element.appendChild(webMid);
  [createWebFactoryTiles, createWebMiddleArea].forEach(myFunc => element.appendChild(myFunc(state)));
  $boardSection.appendChild(element);
  if ((state.turnOrder[state.currentPlayer].name === name) && state.activeGrab) {
    createWebInstructions(state);
  }
}

const createRoomMessage = () => {
  const message = `If the room already has unknown players, please leave the room by pressing Reset and choose another. 
  You can press Ready to prompt a game start. Once all players in a room have pressed Ready, the game will start. You can
  also chat to others in the room while you're waiting.`
  const element = document.createElement('div');
  element.classList.add('roomMessage')
  element.innerHTML = `<p>${message}</p>`;
  // const attachTo = document.
  $boardSection.appendChild(element);
}

export { renderWebMainArea, createWebInstructions, createRoomMessage };