import {renderWebMainArea} from "./webGameRender.js";
import {renderWebPlayerBoard} from "./../src/renderPlayerBoard.js"; ///////////////////////////
import {$activePlayerSection, $boardSection} from "../main.js";
import fetches from "../api/fetches.js";
import {webState, name, nextTurn, room} from "./startMGame.js"; ////////////////////////////////////////
import { createWebInstructions } from "./webGameRender.js";

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
const grabWebMiddle = async (tileId, tileColor) => {

  if (!webState.activeGrab) return;
  if (webState.turnOrder[webState.currentPlayer].name !== name) return;

  for (let i=0; i<webState.middle[tileId].length; i++) {
    if (webState.middle[tileId][i] === tileColor) {
      webState.turnOrder[webState.currentPlayer].limbo.push(...webState.middle[tileId].splice(i,1));
      i--;
    } else if (webState.middle[tileId][i] === 'first') {
      webState.turnOrder[webState.currentPlayer].limbo.push(...webState.middle[tileId].splice(i,1));
      i--;
    } else if (tileId !== 0) {
      webState.middle[0].push(...webState.middle[tileId].splice(i,1));
      i--;
    }
  };
  renderWebPlayerBoard(webState.turnOrder[webState.currentPlayer], $activePlayerSection); //////////////////////////////////////
  webState.activeGrab = false;
  renderWebMainArea(webState);
  webState.activeStaging = true;
  createWebInstructions(webState);
};

/**
 * The event handler for clicking on a row of staging to move your limbo tiles in. This click handler
 * is only active after the active player has grabbed from the middle, and turns itself off afterwards.
 * The event handler is automatically created on the rendered active player's playerboard on each of the
 * five rows in the player's staging area.
 * @param {number}, the index of the row in the player's staging area being clicked on.
 */
const placeWebStaging = async (rowID) => {

  if (!webState.activeStaging) return; // activeStaging is set to true at the end of grabMiddle
  if (webState.turnOrder[webState.currentPlayer].name !== name) return;

  // this for loop moves the first player tile to where it needs to go, and sets turn order for next round
  for (let i=0; i<webState.turnOrder[webState.currentPlayer].limbo.length; i++) {
    if (webState.turnOrder[webState.currentPlayer].limbo[i] === 'first') {
      webState.turnOrder[webState.currentPlayer].firstNext = true;
      if (webState.turnOrder[webState.currentPlayer].broken.length === 7) {
        webState.turnOrder[webState.currentPlayer].limbo.splice(i,1);
      } else {
        webState.turnOrder[webState.currentPlayer].broken.push(webState.turnOrder[webState.currentPlayer].limbo.splice(i,1)[0]);
      }
    };
  };

  // If broken area is chosen, move tiles there, then close activeStaging, re-render, and escape.
  if (rowID === 5) {
    if (!confirm('You have chosen to break all your chosen tiles; press OK to continue.')) return;
    for (let i=0; i<webState.turnOrder[webState.currentPlayer].limbo.length; i++) {
      if (webState.turnOrder[webState.currentPlayer].broken.length === 7) {
        webState.discard.push(webState.turnOrder[webState.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      } else {
        webState.turnOrder[webState.currentPlayer].broken.push(webState.turnOrder[webState.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      }
    }
    webState.activeStaging = false;
    $boardSection.removeChild(document.querySelector('.instructions'));
    renderWebPlayerBoard(webState.turnOrder[webState.currentPlayer], $activePlayerSection);
    await nextTurn(); //////////////////////////////////////////////////////////////////////////////////////////
    return;
  }
  // If chosen row in staging has a different color from the limbo tiles, return.
  if (webState.turnOrder[webState.currentPlayer].staging[rowID].length) {
    if (webState.turnOrder[webState.currentPlayer].limbo[0] !== webState.turnOrder[webState.currentPlayer].staging[rowID][0]) {
      return;
    }
  }

  // If chosen row's equivalent landing area has the same color tile already, return.
  for (let i=0; i<5; i++) {
    if (webState.turnOrder[webState.currentPlayer].limbo[0] === webState.turnOrder[webState.currentPlayer].landing[rowID][i]) {
      return;
    }
  }

  // Otherwise, move limbo tiles in that staging area row one by one.
  // If full, move limbo tiles to broken area; if that is full, move limbo tiles to discard.
  for (let i=0; i<webState.turnOrder[webState.currentPlayer].limbo.length; i++) {
    if (webState.turnOrder[webState.currentPlayer].staging[rowID].length >= rowID + 1) {
      if (webState.turnOrder[webState.currentPlayer].broken.length === 7) {
        webState.discard.push(webState.turnOrder[webState.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      } else {
        webState.turnOrder[webState.currentPlayer].broken.push(webState.turnOrder[webState.currentPlayer].limbo.splice(i, 1)[0]);
        i--;
      }
    } else {
      webState.turnOrder[webState.currentPlayer].staging[rowID].push(webState.turnOrder[webState.currentPlayer].limbo.splice(i, 1)[0])
      i--;
    }
  }

  // Finish moving to staging, re-render player board, and check if there should be a new turn or not.
  webState.activeStaging = false;
  $boardSection.removeChild(document.querySelector('.instructions'));
  renderWebPlayerBoard(webState.turnOrder[webState.currentPlayer], $activePlayerSection);
  await nextTurn();
};

export { placeWebStaging, grabWebMiddle} 