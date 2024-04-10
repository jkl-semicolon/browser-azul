import {renderPlayers} from "./renderPlayerBoard.js";
import {endRoundScoring, endGameScoring} from "./scoringEndGame.js";
import {startRound} from "./roundSetup.js";
import {createInstructions} from "./renderMainArea.js";
import state from "./state.js";

/**
 * Occurs either at the end of a round start, or if another turn is
 * determined to be needed. Switches the current player, renders
 * player boards in correct positions, and turns on first event 
 * listener for the active player.
 */
const takeTurn = () => {

  state.currentPlayer = state.turnCounter % state.turnOrder.length
  state.turnCounter++;
  renderPlayers();
  state.activeGrab = true;
  createInstructions(state.turnOrder[state.currentPlayer]);
};

/**
 * Occurs at the end of the second event handler of a player's turn. 
 * Checks to see if another turn in the round is needed, and either a new
 * turn occurs or end round scoring occurs.
 */
const newTurnOrNawww = () => {
  let midHasTiles;
  state.middle.forEach((part) => {
    if (part.length) midHasTiles = true;
  });
  if (midHasTiles) takeTurn();
  else endRoundScoring();
};

/**
 * Checks if the end game condition of a player finishing a row in their landing area.
 * If so, game proceeds to end game scoring. Otherwise, start another round.
 */
const newRoundOrNawww = () => {
  for (const player of state.players) {
    for (const playerLandingRow of player.landing) {
      if (playerLandingRow.length === 5) {
        endGameScoring();
        return;
      }
    }
  }
  startRound();
}

export {takeTurn, newTurnOrNawww, newRoundOrNawww}