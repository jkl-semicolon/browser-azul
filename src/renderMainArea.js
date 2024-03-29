import {state, $boardSection, $playerSection} from './../main.js';
import renderPlayerBoard from './renderPlayerBoard.js';

/**
 * Occurs at the start of a new round, and also occurs anytime a user input in the game happens. 
 * Creates the factory tiles and possible tiles on those factory tiles depending on their state.
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
      tile.addEventListener('click', () => {grabMiddle(event, tile.id, tile.classList[0])});
      factoryTile.appendChild(tile);
    };
    element.appendChild(factoryTile);
  };
  return element;
};

/**
 * Occurs at the start of a new round, and also occurs anytime a user input in the game happens. 
 * Creates the middle area that can hold an indefinite amount of tiles.
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
      midTile.addEventListener('click', () => {grabMiddle(event, midTile.id, midTile.classList[0])});
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
  console.log('main area rendering')
  console.log('state.middle:', state.middle);
  $boardSection.innerHTML = '';
  const element = document.createElement('div');
  [createFactoryTiles, createMiddleArea].forEach(myFunc => element.appendChild(myFunc()));
  return element;
};

const grabMiddle = (event, tileId, tileColor) => {
  if (state.activeGrab) return;
  console.log(event.target);
  console.log(tileId);
  console.log(tileColor);

  for (let i=0; i<state.middle[tileId].length; i++) {
    // console.log(state.middle[tileId][i])
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
  console.log(state.players[state.currentPlayer].limbo);
  console.log(state.players[state.currentPlayer])
  console.log(state.middle[tileId])
  $boardSection.appendChild(renderMainArea());
  $playerSection.appendChild(renderPlayerBoard(state.players[2]));
};

export default renderMainArea;