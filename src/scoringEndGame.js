import { newRoundOrNawww } from "./gameFlow.js";
import { renderPlayers, landingPattern } from "./renderPlayerBoard.js";
import state from "./state.js";

/**
 * Occurs at the end of each round. Completes scoring and sets up playerboard
 * for each player for the next round.
 */
const endRoundScoring = () => {

  state.players.forEach((player) => { 
    player.staging.forEach((row, i) => {

      if (row.length === i + 1) {
        const scoredTile = row[0];
        player.landing[i].push(row.shift());
        while (row[0]) state.discard.push(row.pop());
        const scoredIndex = landingPattern[i].indexOf(scoredTile);

        let hScore = 0;
        for (let j=scoredIndex; j<4; j++) {
          if (player.landing[i].indexOf(landingPattern[i][j+1]) !== -1) hScore++;
          else break;
        }
        for (let j=scoredIndex; j>0; j--) {
          if (player.landing[i].indexOf(landingPattern[i][j-1]) !== -1) hScore++;
          else break;
        }
        if (hScore !== 0) hScore++;

        let vScore = 0;
        for (let j=i; j<4; j++) {
          if (player.landing[j+1].indexOf(landingPattern[j+1][scoredIndex]) !== -1) vScore++;
          else break;
        }
        for (let j=i; j>0; j--) {
          if (player.landing[j-1].indexOf(landingPattern[j-1][scoredIndex]) !== -1) vScore++;
          else break;
        }
        if (vScore !== 0) vScore++;
        let earnedScore = hScore + vScore;
        if (earnedScore === 0) earnedScore++;
        player.score += earnedScore; // TODO keep track of player's vscore and hscore for reporting.
      }
    });

    const negScores = [-1,-2,-4,-6,-8,-11,-14];
    if (player.broken.length) player.score += negScores[player.broken.length-1];
    if (player.score < 0) player.score = 0;
    while (player.broken.length) {
      if (player.broken[0] === 'first') player.broken.shift();
      else state.discard.push(player.broken.shift());
    }
  });
  newRoundOrNawww();
};

/**
 * Occurs at the end of game, after the last round. Applies bonus
 * score to all the players depending on the state of their landing area.
 * Renders each player's board state after final score calculation, and
 * proceeds to announcing the winner.
 */
const endGameScoring = () => {
  state.players.forEach((player) => {
    let rowBonus = 0;
    player.landing.forEach((row) => {
      if (row.length === 5) rowBonus += 2;
    });

    let columnBonus = 0;
    for (let i=0; i<5; i++) {
      let col = true;
      for (let j=0; j<5; j++) {
        if (player.landing[j].indexOf(landingPattern[j][i] === -1)) col = false;
      };
      if (col) columnBonus += 7;
    };

    let colorBonus = 0;
    for (const tile of landingPattern[0]) {
      let color = true;
      player.landing.forEach((row) => {
        if (row.indexOf(tile) === -1) color = false;
      });
      if (color) colorBonus += 10;
    }
    player.score = player.score + rowBonus + columnBonus + colorBonus;
  });
  renderPlayers();
  gameEnd();
};

/**
 * Occurs at the end of the game, calculating the winner and alerting them to the browser.
 * TODO - Implement tiebreaker rules and make the game end more exciting.
 */
const gameEnd = () => {
  let winningScore = 0;
  let winningPlayer;
  state.players.forEach((player) => {
    if (player.score > winningScore) {
      winningScore = player.score;
      winningPlayer = player.name;
    }
  })
  alert(`Congratulations!!! ${winningPlayer} has won with a score of ${winningScore}!!!`);
};

export {endRoundScoring, endGameScoring};