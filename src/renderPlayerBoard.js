import { $playerSection } from "./../main.js";

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
 * @param {object}, the player to create the staging for
 * @returns {object}, the stagingArea html element
 */
const createStaging = (player) => {
  const element = document.createElement('div');
  element.classList.add('stagingArea');
  let index = -1;
  for (let i=4; i>=0; i--) {
    index++;
    const row = document.createElement('div');
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
const createArrows = () => {
  const element = document.createElement('div');
  element.innerHTML = `
    ➡️<br>➡️<br>➡️<br>➡️<br>➡️
  `;
  element.style.fontSize = '1.8rem';
  element.style.marginLeft = '5px';
  element.style.display = 'inline-block';
  return element;
};

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
 * Creates the broken tile area along with player score.
 * @param {object}, the player to create the staging for
 * @returns {object}, the brokenArea html element
 */
const createBrokenScore = (player) => {
  const element = document.createElement('div');
  element.classList.add('brokenArea');
  for (let i=0; i<8; i++) {
    const brokenSpace = document.createElement('div');
    brokenSpace.innerHTML = `<p>${i<3 ? '-1' : i<6 ? '-2' : '-3'}</p>`;
    if (player.broken[i]) brokenSpace.classList.add(`${player.broken[i]}`, 'tile');
    else brokenSpace.classList.add('tile');
    element.appendChild(brokenSpace);
  }
  const score = document.createElement('div');
  score.classList.add('score');
  score.innerHTML = `Score: ${player.score}`;
  element.appendChild(score);
  return element;
};

/**
 * Occurs for each player upon start of game, and anytime a user input in the game happens. 
 * Creates a player's board html elements depending on their state.
 * @param {object}, the player that is being rendered
 * @return {object}, the DOM element containing the playerboard and tiles of the player being rendered.
 */
const renderPlayerBoard = (player) => {
  $playerSection.innerHTML = '';
  const element = document.createElement('div');
  [createLimbo, createStaging, createArrows, createLanding, createBrokenScore].forEach(myFunc => 
    element.appendChild(myFunc(player))
  );
  return element;
};

export default renderPlayerBoard;