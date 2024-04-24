import {$boardSection} from './../main.js';
import {grabMiddle} from './eventListeners.js';
import state from './state.js';

/**
 * Occurs at the start of a new round, and also occurs anytime a user input in the game happens. 
 * Creates the factory tiles and possible tiles on those factory tiles depending on their state.
 * Adds an event listener to each tile, which are only active if it is time
 * for a player to take tiles from the middle.
 * @returns {object}, the factory tiles with possible tiles on them.
 */
const createFactoryTiles = () => {
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
      tile.addEventListener('click', () => {grabMiddle(Number(tile.id), tile.classList[0])});
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
const createInstructions = (player) => {
  const element = document.createElement('div');
  element.classList.add('floating', 'instructions');
  if (state.activeGrab) {
    element.innerHTML = `
      It is ${player.name}'s turn. Please choose tiles of the same color
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
const createMiddleArea = () => {
  const element = document.createElement('div');
  element.classList.add('middleArea');
  for (const tile of state.middle[0]) {
    if (tile !== 'first') {
      const midTile = document.createElement('div');
      midTile.classList.add(`${tile}`, 'tile');
      midTile.id = 0;
      midTile.addEventListener('click', () => {grabMiddle(Number(midTile.id), midTile.classList[0])});
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
const renderMainArea = () => {
  $boardSection.innerHTML = '';
  const element = document.createElement('div');
  [createFactoryTiles, createMiddleArea].forEach(myFunc => element.appendChild(myFunc()));
  $boardSection.appendChild(element);
}

const createStartMessage = () => {
  const message = `Thanks for playing! In order to start a single browser game, press the 
  Start 2P, 3P, or 4P buttons. In order to start a game over separate browsers, please first
  spin-up the server by pressing test server. Once a green light is achieved (which may take upwards of 30 seconds),
  press the Multiplayer button, and then enter a name and room number. Please coordinate with your opponents on which room to join. If you see a room already 
  has unknown players, please leave the room by pressing Reset and choose another. Once you have joined a room, you may press 
  Ready to prompt a game start. Once all players in a room have pressed Ready, the game will start.`
  const element = document.createElement('div');
  element.classList.add('landingMessage')
  element.innerHTML = `<p>${message}</p>`;
  $boardSection.appendChild(element);
}

export {renderMainArea, createInstructions, createStartMessage};