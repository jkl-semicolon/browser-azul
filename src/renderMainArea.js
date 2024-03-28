import {state} from './../main.js';

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
      tile.classList.add('tile',`${state.middle[i][j]}`);
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
  const element = document.createElement('div');
  [createFactoryTiles, createMiddleArea].forEach(myFunc => element.appendChild(myFunc()));
  return element;
};

export default renderMainArea;