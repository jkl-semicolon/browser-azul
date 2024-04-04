import {state, $boardSection, $playerSection} from './../main.js';
import renderPlayerBoard from './renderPlayerBoard.js';

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
      tile.addEventListener('click', () => {grabMiddle(event, Number(tile.id), tile.classList[0])});
      factoryTile.appendChild(tile);
    };
    element.appendChild(factoryTile);
  };
  return element;
};

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
      midTile.addEventListener('click', (event) => {grabMiddle(event, Number(midTile.id), midTile.classList[0])});
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
 * Occurs during the start of a player's turn.
 * This function allows players to either choose to take all the tiles of a single color from 
 * a factory tile or the middle area. If player chooses from a factory tile, the tiles not of
 * that color go into the middle. If player chooses from the middle, if first player tile is
 * in the middle, player also takes that tile. At the end of this function, players are 
 * prompted to place the tiles they have chosen.
 * @param {event}, the event of the tile being clicked; this parameter is not used but 
 * code does not run correctly if this parameter is removed
 * @param {string} tileId, is a string because this is an html attribute; was set on the tile
 * to flag which factory tile the tile is from
 * @param {string} tileColor, the color of the tile and its html class
 * @returns 
 */
const grabMiddle = (event, tileId, tileColor) => {

  if (!state.activeGrab) return;

  for (let i=0; i<state.middle[tileId].length; i++) {
    if (state.middle[tileId][i] === tileColor) {
      state.players[state.currentPlayer].limbo.push(...state.middle[tileId].splice(i,1));
      i--;
    } else if (state.middle[tileId][i] === 'first') {
      state.players[state.currentPlayer].limbo.push(...state.middle[tileId].splice(i,1));
      i--;
    } else if (tileId !== 0) {
      state.middle[0].push(...state.middle[tileId].splice(i,1));
      i--;
    }
  };
  renderMainArea();
  renderPlayerBoard(state.players[state.currentPlayer], $playerSection);
  state.activeGrab = false;
  state.activeStaging = true;
};

// const placeTile = () => {
//   console.log(document.querySelectorAll(`#playerSection > div > #stagingArea > div`));
// };

// #playerSection > div > #stagingArea > div

/**
 * Renders the main area along with its factory tiles, 1st player tile, and colored tiles.
 */
const renderMainArea = () => {
  $boardSection.innerHTML = '';
  const element = document.createElement('div');
  [createFactoryTiles, createMiddleArea].forEach(myFunc => element.appendChild(myFunc()));
  $boardSection.appendChild(element);
};

export default renderMainArea;