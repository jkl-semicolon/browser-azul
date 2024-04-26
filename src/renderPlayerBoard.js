import { $activePlayerSection, $otherPlayerSections } from './../main.js';
import { placeStaging } from './eventListeners.js';
import { placeWebStaging } from '../multiplayer/webEventListeners.js';
import state from './state.js';

/**
 * Local variable used for createStaging.
 */
const landingPattern = [
  ['blue','yellow','red','purple','green'],
  ['green','blue','yellow','red','purple'],
  ['purple','green','blue','yellow','red'],
  ['red','purple','green','blue','yellow'],
  ['yellow','red','purple','green','blue'],
];

/**
 * Creates the limbo area with colored tiles on a playerboard.
 * @param {object}, the player to create limbo for
 * @returns {object}, the limboArea html element
 */
const createLimbo = (player) => {
  const element = document.createElement('div');
  element.classList.add('limboArea');
  player.limbo.forEach((tile) => {
    const limboTile = document.createElement('div');
    limboTile.classList.add('tile', `${tile}`);
    element.appendChild(limboTile);
  });
  return element;
};

/**
 * Creates the staging area with colored tiles on a playerboard.
 * @param {object, DOM object}, the player to create the staging for; and the player area we are creating in
 * @returns {object}, the stagingArea html element
 */
const createStaging = (player, section) => {
  const element = document.createElement('div');
  element.classList.add('stagingArea');
  let index = -1;
  for (let i=4; i>=0; i--) {
    index++;
    const row = document.createElement('div');
    if (section === $activePlayerSection) {
      row.id = Math.abs(i - 4);
      row.addEventListener('click', () => {placeStaging(Number(row.id))});
    };
    for (let j=i; j>0; j--) {
      const hiddenTile = document.createElement('div');
      hiddenTile.classList.add('hiddenTile', 'tile');
      row.appendChild(hiddenTile);
    };
    const blankSpace = 5 - i - player.staging[index].length;
    for (let j=blankSpace; j>0; j--) {
      const blankTileSpace = document.createElement('div');
      blankTileSpace.classList.add('blankTileSpace', 'tile');
      row.appendChild(blankTileSpace);
    };
    player.staging[index].forEach((stateStagingTile) => {
      const stagingTile = document.createElement('div');
      stagingTile.classList.add(`${stateStagingTile}`, 'tile');
      row.appendChild(stagingTile);
    });
    element.appendChild(row);
  };
  return element;
};

/**
 * Creates the staging area with colored tiles on a playerboard.
 * @param {object, DOM object}, the player to create the staging for; and the player area we are creating in
 * @returns {object}, the stagingArea html element
 */
const createWebStaging = (player, section) => {
  const element = document.createElement('div');
  element.classList.add('stagingArea');
  let index = -1;
  for (let i=4; i>=0; i--) {
    index++;
    const row = document.createElement('div');
    if (section === $activePlayerSection) {
      row.id = Math.abs(i - 4);
      row.addEventListener('click', () => {placeWebStaging(Number(row.id))});
    };
    for (let j=i; j>0; j--) {
      const hiddenTile = document.createElement('div');
      hiddenTile.classList.add('hiddenTile', 'tile');
      row.appendChild(hiddenTile);
    };
    const blankSpace = 5 - i - player.staging[index].length;
    for (let j=blankSpace; j>0; j--) {
      const blankTileSpace = document.createElement('div');
      blankTileSpace.classList.add('blankTileSpace', 'tile');
      row.appendChild(blankTileSpace);
    };
    player.staging[index].forEach((stateStagingTile) => {
      const stagingTile = document.createElement('div');
      stagingTile.classList.add(`${stateStagingTile}`, 'tile');
      row.appendChild(stagingTile);
    });
    element.appendChild(row);
  };
  return element;
};

/**
 * Creates the arrows between the staging and landing areas of the player board.
 * @returns {object}, the arrows that go between staging and landing.
 */
const createArrows2 = () => {
  const element = document.createElement('div');
  element.classList.add('arrowArea');
  for (let i=0; i<5; i++) {
    const arrow = document.createElement('div');
    arrow.classList.add('tile', 'arrow');
    if (i === 4) arrow.style.marginBottom = '0';
    element.appendChild(arrow);
  }
  return element;
}

/**
 * Creates the landing area with colored tiles on a playerboard.
 * @param {object}, the player to create the staging for
 * @returns {object}, the landingArea html element
 */
const createLanding = (player) => {
  const element = document.createElement('div');
  element.classList.add('landingArea');
  for (let i=0; i<landingPattern.length; i++) {
    const row = document.createElement('div');
    landingPattern[i].forEach((pattern) => {
      const landingSpace = document.createElement('div');
      landingSpace.classList.add(`${pattern}`, 'tile', 'landingSpace');
      player.landing[i].forEach((tile) => {
        if (tile === pattern) {
          landingSpace.classList.remove('landingSpace');
        };
      });
      row.appendChild(landingSpace);
    });
    element.appendChild(row);
  };
  return element;
};

/**
 * Creates the broken tile area.
 * @param {object}, the player to create the broken area for
 * @returns {object}, the brokenArea html element
 */
const createBroken = (player) => {
  const element = document.createElement('div');
  element.classList.add('brokenArea');
  for (let i=0; i<7; i++) {
    const brokenSpace = document.createElement('div');
    brokenSpace.innerHTML = `<p>${i<2 ? '-1' : i<5 ? '-2' : '-3'}</p>`;
    if (player.broken[i]) brokenSpace.classList.add(`${player.broken[i]}`, 'tile');
    else brokenSpace.classList.add('tile');
    brokenSpace.addEventListener('click', () => {placeWebStaging(5)}) // placeStaging argument set to 5 for broken area.
    element.appendChild(brokenSpace);
  }
  return element;
};


/**
 * Creates the score area with the player's name.
 * @param {object}, the player to render the score for 
 * @returns {object}, the scoreArea html element
 */
const createScore = (player) => {
  const element = document.createElement('div');
  element.classList.add('scoreArea', 'title');
  element.innerHTML = `${player.name}'s Score: ${player.score}`;
  return element;
}

/**
 * Occurs for each player upon start of game, and anytime a user input in the game happens. 
 * Creates a player's board html elements depending on their state.
 * @param {object, DOM object}, the player that is being rendered; and the html element the player board will be appended to.
 * @return {object}, the DOM element containing the playerboard and tiles of the player being rendered.
 */
const renderPlayerBoard = (player, section) => {
  section.innerHTML = '';
  const element = document.createElement('div');
  [createLimbo, createScore, createStaging, createArrows2, createLanding, createBroken].forEach(myFunc => {
    element.appendChild(myFunc(player, section))
  });
  element.style.backgroundColor = player.color;
  section.appendChild(element);
};

/**
 * Occurs for each player upon start of game, and anytime a user input in the game happens. 
 * Creates a player's board html elements depending on their state.
 * @param {object, DOM object}, the player that is being rendered; and the html element the player board will be appended to.
 * @return {object}, the DOM element containing the playerboard and tiles of the player being rendered.
 */
const renderWebPlayerBoard = (player, section) => {
  section.innerHTML = '';
  const element = document.createElement('div');
  [createLimbo, createScore, createWebStaging, createArrows2, createLanding, createBroken].forEach(myFunc => {
    element.appendChild(myFunc(player, section))
  });
  element.style.backgroundColor = player.color;
  section.appendChild(element);
};

/**
 * Renders the playerboards for all the players in the correct positions,
 * depending on the current active player.
 */
const renderPlayers = () => {
  let p2Empty = true;
  let p3Empty = true;
  for (const player of state.turnOrder) {
    const index = state.turnOrder.indexOf(player);
    if (index === state.currentPlayer) {
      renderPlayerBoard(player, $activePlayerSection);
    } else if (p2Empty) {
      renderPlayerBoard(player, $otherPlayerSections[0]);
      p2Empty = false;
    } else if (p3Empty) {
      renderPlayerBoard(player, $otherPlayerSections[1]);
      p3Empty = false;
    } else {
      renderPlayerBoard(player, $otherPlayerSections[2]);
    }
  }
}

/**
 * Renders the playerboards for all the players in the correct positions,
 * depending on the current active player.
 */
const renderWebPlayers = (webState) => {
  let p2Empty = true;
  let p3Empty = true;
  for (const player of webState.turnOrder) {
    const index = webState.turnOrder.indexOf(player);
    if (index === webState.currentPlayer) {
      renderWebPlayerBoard(player, $activePlayerSection);
    } else if (p2Empty) {
      renderWebPlayerBoard(player, $otherPlayerSections[0]);
      p2Empty = false;
    } else if (p3Empty) {
      renderWebPlayerBoard(player, $otherPlayerSections[1]);
      p3Empty = false;
    } else {
      renderWebPlayerBoard(player, $otherPlayerSections[2]);
    }
  }
}

export {landingPattern, renderPlayerBoard, renderPlayers, renderWebPlayers, renderWebPlayerBoard};