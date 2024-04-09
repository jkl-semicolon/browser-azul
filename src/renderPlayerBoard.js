/**
 * Local variable used for createStaging.
 */
export const landingPattern = [
  ['blue','yellow','red','purple','green'],
  ['green','blue','yellow','red','purple'],
  ['purple','green','blue','yellow','red'],
  ['red','purple','green','blue','yellow'],
  ['yellow','red','purple','green','blue'],
];

import {$playerSection, $player2Section, $player3Section, $player4Section, state, newTurnOrNawww, $boardSection } from './../main.js';

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
    if (section === $playerSection) {
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
 * The event handler for clicking on a row of staging to move your limbo tiles in. This click handler
 * is only active after the active player has grabbed from the middle, and turns itself off afterwards.
 * The event handler is automatically created on the rendered active player's playerboard on each of the
 * five rows in the player's staging area.
 * @param {number}, the index of the row in the player's staging area being clicked on.
 */
const placeStaging = (rowID) => {

  if (!state.activeStaging) return; // activeStaging is set to true at the end of grabMiddle

  // this for loop moves the first player tile to where it needs to go, and sets turn order for next round
  for (let i=0; i<state.turnOrder[state.currentPlayer].limbo.length; i++) {
    if (state.turnOrder[state.currentPlayer].limbo[i] === 'first') {
      state.turnOrder[state.currentPlayer].firstNext = true;
      if (state.turnOrder[state.currentPlayer].broken.length === 7) {
        state.turnOrder[state.currentPlayer].limbo.splice(i,1);
      } else {
        state.turnOrder[state.currentPlayer].broken.push(state.turnOrder[state.currentPlayer].limbo.splice(i,1)[0]);
      }
    };
  };

  // If broken area is chosen, move tiles there, then close activeStaging, re-render, and escape.
  if (rowID === 5) {
    if (!confirm('You have chosen to break all your chosen tiles; press OK to continue.')) return;
    for (let i=0; i<state.turnOrder[state.currentPlayer].limbo.length; i++) {
      if (state.turnOrder[state.currentPlayer].broken.length === 7) {
        state.discard.push(state.turnOrder[state.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      } else {
        state.turnOrder[state.currentPlayer].broken.push(state.turnOrder[state.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      }
    }
    state.activeStaging = false;
    renderPlayerBoard(state.turnOrder[state.currentPlayer], $playerSection);
    newTurnOrNawww();
    return;
  }
  // If chosen row in staging has a different color from the limbo tiles, return.
  if (state.turnOrder[state.currentPlayer].staging[rowID].length) {
    if (state.turnOrder[state.currentPlayer].limbo[0] !== state.turnOrder[state.currentPlayer].staging[rowID][0]) {
      return;
    }
  }

  // If chosen row's equivalent landing area has the same color tile already, return.
  for (let i=0; i<5; i++) {
    if (state.turnOrder[state.currentPlayer].limbo[0] === state.turnOrder[state.currentPlayer].landing[rowID][i]) {
      return;
    }
  }

  // Otherwise, move limbo tiles in that staging area row one by one.
  // If full, move limbo tiles to broken area; if that is full, move limbo tiles to discard.
  for (let i=0; i<state.turnOrder[state.currentPlayer].limbo.length; i++) {
    if (state.turnOrder[state.currentPlayer].staging[rowID].length >= rowID + 1) {
      if (state.turnOrder[state.currentPlayer].broken.length === 7) {
        state.discard.push(state.turnOrder[state.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      } else {
        state.turnOrder[state.currentPlayer].broken.push(state.turnOrder[state.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      }
    } else {
      state.turnOrder[state.currentPlayer].staging[rowID].push(state.turnOrder[state.currentPlayer].limbo.splice(i, 1)[0])
      i--;
    }
  }

  // Finish moving to staging, re-render player board, and check if there should be a new turn or not.
  state.activeStaging = false;
  renderPlayerBoard(state.turnOrder[state.currentPlayer], $playerSection);
  newTurnOrNawww();
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
    brokenSpace.addEventListener('click', () => {placeStaging(5)}) // placeStaging argument set to 5 for broken area.
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

export const createInstructions = (player) => {
  const element = document.createElement('div');
  element.classList.add('floating');
  if (state.activeGrab) {
    element.innerHTML = `
      It is ${player.name}'s turn. Please choose tiles of the same color
      from either one of factory tiles in the middle, or the middle area
      next to the factory tiles. Afterwards, choose a row on your playerboard 
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
 * 
 * TODO
 */
export const renderPlayers = () => {
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
}

export default renderPlayerBoard;