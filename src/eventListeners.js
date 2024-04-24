import {renderMainArea, createInstructions} from "./renderMainArea.js";
import {renderPlayerBoard} from "./renderPlayerBoard.js";
import {$activePlayerSection, $boardSection} from "../main.js";
import {newTurnOrNawww} from './gameFlow.js';
import state from "./state.js";

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
const grabMiddle = (tileId, tileColor) => {

  if (!state.activeGrab) return;

  for (let i=0; i<state.middle[tileId].length; i++) {
    if (state.middle[tileId][i] === tileColor) {
      state.turnOrder[state.currentPlayer].limbo.push(...state.middle[tileId].splice(i,1));
      i--;
    } else if (state.middle[tileId][i] === 'first') {
      state.turnOrder[state.currentPlayer].limbo.push(...state.middle[tileId].splice(i,1));
      i--;
    } else if (tileId !== 0) {
      state.middle[0].push(...state.middle[tileId].splice(i,1));
      i--;
    }
  };
  renderMainArea();
  renderPlayerBoard(state.turnOrder[state.currentPlayer], $activePlayerSection);
  state.activeGrab = false;
  state.activeStaging = true;
  createInstructions(state.turnOrder[state.currentPlayer]);
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
    $boardSection.removeChild(document.querySelector('.instructions'));
    renderPlayerBoard(state.turnOrder[state.currentPlayer], $activePlayerSection);
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
  $boardSection.removeChild(document.querySelector('.instructions'));
  renderPlayerBoard(state.turnOrder[state.currentPlayer], $activePlayerSection);
  newTurnOrNawww();
};

export {grabMiddle, placeStaging}