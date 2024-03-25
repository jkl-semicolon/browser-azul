/**
 * &&&&&&&&&&&&&&&&&&&&       Web Browser Azul        &&&&&&&&&&&&&&&&&&&&
 * 
 * Simulates the popular board game Azul in your web browser.
 * BoardGameGeek entry: https://boardgamegeek.com/boardgame/230802/azul
 * 
 * - Single webpage play for 2-4 players in a hotseat format.
 * - Multiple webpage play for 2-4 players; requires a player to host an API for game state.
 * - Header will contain buttons to start a 2-4 person hotseat game,
 *   or to start a 2-4 person multiple webpage game. Header will also
 *   contain a link to the rules and a reset button for the game.
 * 
 * UI Mock-up: https://excalidraw.com/#json=5A1Qs7M1Xwagbi-VdDQzO,4UbnZ3Pjpiu9dvg4_5PQuQ
 * Playerboard UI Mock-Up: https://excalidraw.com/#json=N80qGXgrPmSGdjNmtWmk8,BZgB_39jdjk9AwewcHqKRA
 * 
 *          ###########       Pseudocode       ###########
 *          ## ------ for website start and reset ----- ## 
 *          ##############################################
 * 
 * 1. Upon loading website, the player, opponent, and middle area will contain relevant text/image/art.
 *  a.  The header will contain box art, buttons for 2P, 3P, 4P hotseat play; 2P, 3P, 4P multiple
 *      browser play, an external link to the rules .pdf, and a reset button.
 *    i.  Reset button is greyed out while game state is game not started.
 *    ii. User can press 2P, 3P, 4P hotseat play buttons to start a game (see game and 
 *        game state flow pseudocode).
 *    iii.User can press 2P, 3P, 4P multiple browser play buttons to start a game
 *        //TODO  implement multiple browser play functionality.
 *    iv. User can press the rules to open a new tab of the rules .pdf.
 *  b.  Upon game start, the reset button will become active.
 *    i.  If a player presses the reset button, a warning message will display. 
 *        If the player continues, the game state will return to how the website was upon first opening.
 *    ii. Upon game start, the hotseat play buttons and multiple browser play buttons will be greyed out.
 *  c.  It is important that the game state does not reset if the website is refreshed.
 *
 *          ###########       Pseudocode       ###########
 *          ## -- for multiple browser functionality -- ## 
 *          ##############################################
 * 
 *  // TODO
 * 
 *          ###########       Pseudocode       ###########
 *          ## ----- for game and game state flow ----- ## 
 *          ##############################################
 * 
 * 1. Game starts.
 *  a.  Set factory tile number, number of players, and player order randomly. 
 * 2. Generate game UI and start game state.
 *  b.  Generate first player start board state in player area.
 *    i.  Invisible top limbo area.
 *      ~ Can hold an indeterminant number of tiles.
 *    ii. Player board with:
 *      ~ staging area of 5 rows, 15 empty tile spaces total,
 *      ~ five arrow emojis stacked vertically,
 *      ~ landing area with 5 different background colors with light shades.
 *      ~ broken tile area with 8 spaces, with negative point values printed inside them.
 *      ~ score area; starts at 0.
 *  c.  Generate other players start board state in opponents area.
 *  d.  Fill bag with 100 tiles and draw them for the main area.
 *  e.  Generate middle area board state.
 *    i.  Create factory tiles and place 4 random tiles on each factory tile.
 *    ii. Create middle area which can hold at least 28 tiles.
 *      ~ Place 1st player tile in middle area.
 * 3. Players take turns until the middle area is empty of tiles.
 *  a.  Between each player's turn, re-render the next player in the player area
 *      and the other players in the opponents area.
 *    i. On the same note, in between each player input, re-render what is needed.
 *  b.  On a player's turn, select a group of the same colored tiles on either
 *      a factory tile or from the middle. Take all of those tiles.
 *    i.  If the 1st player tile is in the middle when you select from the middle,
 *        take the 1st player tile.
 *    ii. The tiles go to the limbo area in the player area.
 *      ~ If the 1st player tile is one of the tiles taken,
 *        it automatically goes to the broken tile area.
 *    iii.A dotted red border appears around the eligible rows for the limbo tiles
 *        to be placed. The player will choose which row the limbo tiles will go.
 *      ~ The player can also choose no row.
 *      ~ The row chosen must either be empty, or if there are tiles the color of them must 
 *        match the tiles in limbo.
 *      ~ The tiles will fill in from the right.
 *    iv. The tiles move from limbo to a staging row. Any extra tiles, including if the
 *        player chooses no row, go to the broken tile area, filling in from the left.
 *      ~ If the broken tile area is full, any extra tiles go to the discard.
 * 4. Once the middle area is empty, we go into scoring phase.
 *  a.  For each player, starting from the top row, if that row of the staging area is full,
 *      one tile from the staging area moves to its space on the same row of the landing area.
 *    i.  The rest of the tiles go to the discard.
 *    ii. Players receive points for the tile that goes over. Check if there's consecutive tiles 
 *        to the left and right of the placed tile. Count the number of consecutive tiles. THen check
 *        if there's consecutive tiles to the top and bottom of the placed tile. Count the number of
 *        consecutive tiles and add that number to the number of consecutive horizontal tiles,
 *        then add that to the player's score.
 *  b.  Next, subtract the point values from tiles in the broken tile area. 
 *    i.  Those tiles then go to the discard. 
 *    ii. A player's score cannot go negative.
 * 5. Check if the game is over. The game is over if any player has a filled row in the landing area.
 *  a.  If the game is not over, a new round starts.
 *    i.  Determine new player order; the player with the 1st player tile will go first, and 
 *        the rest of the players then clockwise.
 *    ii. Reset the main area with the factory tiles and four random tiles on each.
 *      ~ If the bag is empty, move the discarded tiles to the bag and continue filling.
 *      ~ If both discard and the bag are empty, stop filling factory tiles and play as is.
 *      ~ Place 1st player token in the middle.
 *    iii.Render player states again, with 1st player in the player area and other players in opponents area.
 *    iv. Start the round.
 *  b.  If the game is over, calculate the end game bonuses for each player.
 *    i.  Gain 2 points for each full horizontal line in the landing area.
 *    ii. Gain 7 points for each full vertical line in the landing area.
 *    iii.Gain 10 points for each color filled in your landing area.
 *  c. Determine winner and display victory. If tie, most completed horizonal lines is the winner; 
 *     still tie, share victory.
 *    i.  Reset game state to before game starts.
 * 
 */

/**
 *          #############################################
 *          ## ---------- Game State Object ---------- ## 
 *          #############################################
 */

const state = {

  gameStart: false, // boolean
  numberPlayers: 0, // enumerated number, either 2, 3, or 4
  factoryTiles: 0, // enumerated number, either 5, 7, or 9
  turnOrder: [],  // array of numbers for players' indexes

  bag: [],  // array of strings for tiles
  discard: [],  // array of strings for tiles
  middle: [[],],  //  array of arrays, with state.middle[0] being the middle area, and 
               //  state.middle[1] being factory tile 1, and so on
  players: [],  // array of up to 4 player objects; see function initializePlayers
  currentPlayer: 0,  // number of player's index
  gameEnd: false, // boolean
  winner: 0, // number of player's index
};

/**
 *          #############################################
 *          ## ----------- DOM Connections ----------- ## 
 *          #############################################
 */

const $player2Section = document.querySelector('#player2Section');
const $player3Section = document.querySelector('#player3Section');
const $player4Section = document.querySelector('#player4Section');
const $boardSection = document.querySelector('#boardSection');
const $playerSection = document.querySelector('#playerSection');

/**
 *          #############################################
 *          ## ----------- Event Listeners ----------- ## 
 *          #############################################
 * 
 * //TODO
 * 
 */

/**
 *          #############################################
 *          ## ----------- Game Functions ------------ ## 
 *          #############################################
 */

/**
 * Initializes empty player objects in state.players.
 * @param {number} numberPlayers, the number of players selected
 */
const initializePlayers = (numberPlayers) => {
  for (let i=0; i<numberPlayers; i++) {
    state.players.push({
      name: `Player ${i+1}`,
      score: 0,  // number
      limbo: [], // array of strings for tiles
      staging: [[],[],[],[],[],],  // array of arrays of strings for tiles
      landing:  [[],[],[],[],[],], // array of arrays of strings for tiles
      broken: [], // array of strings for tiles
      firstNext: false, //  boolean for first in turn order next round
    });
  };
};

/**
 * Helps set the factory tiles for the number of players.
 */
const setFactoryTiles = () => {
  state.factoryTiles = (state.players.length === 2) ? 5 : (state.players.length === 3) ? 7 : 9;
};

/**
 * Fisher-Yates Shuffle, sourced from: https://bost.ocks.org/mike/shuffle/.
 * To help randomize players for function setTurnOrder.
 * @param {array}, array of player objects 
 * @returns {array}, array of shuffled player objects
 */
const shuffle = (array) => {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  };
  return array;
};

/**
 * Sets player order randomly at the start, then sets player order according to
 * the 1st player marker at the start of subsequent rounds.
 */
const setPlayerOrder = () => {
  state.turnOrder = shuffle([...state.players]);
  for (let i=0; i<state.turnOrder.length; i++) {
    if (state.turnOrder[i].firstNext) {
      state.players[i].firstNext = false;
      state.turnOrder.unshift(state.turnOrder.splice(i,1)[0]);
    };
  };
};

/**
 * Occurs upon player selection button press. 
 * Initialize players, set factory tile number, and player order randomly.
 * @param {number} numberPlayers, the number of players selected
 */
const startGame = (numberPlayers) => {
  initializePlayers(numberPlayers);
  setFactoryTiles();
  setPlayerOrder();
};


startGame(4); ////////////////////////////////////////////////////////////////////////////////////////////////
// console.log(state);
// state.players[2].limbo.push('red');
// state.players[2].limbo.push('blue');
// state.players[2].limbo.push('blue');
// state.players[2].limbo.push('purple');
// console.log(state);

/**
 * Creates the limbo area with colored tiles on a playerboard.
 * @param {object}, the player to create limbo for
 * @returns {object}, the limboArea html element
 */
const createLimbo = (player) => {
  const element = document.createElement('div');
  element.classList.add('limboArea');
  player.limbo.forEach((stateLimboTile) => {
    const limboTile = document.createElement('div');
    limboTile.classList.add(`${stateLimboTile}`);
    element.appendChild(limboTile);
  });
  return element;
};

// player.landing:  [[],[],[],[],[],],
console.log(state);
state.players[2].landing[0].push('red');
state.players[2].landing[1].push('blue','blue');
state.players[2].landing[2].push('yellow','yellow','yellow');
state.players[2].landing[3].push('blue','blue','blue');
state.players[2].landing[4].push('purple','purple','purple','purple');
console.log(state);

/**
 * Creates the landing area with colored tiles on a playerboard.
 * @param {object}, the player to create the landing for
 * @returns {object}, the landingArea html element
 */
const createLanding = (player) => {
  const element = document.createElement('div');
  element.classList.add('landingArea');
  let index = -1;
  for (let i=4; i>=0; i--) {
    index++;
    const row = document.createElement('div');
    for (let j=i; j>0; j--) {
      const hiddenTile = document.createElement('div');
      hiddenTile.classList.add('hiddenTile', 'tile');
      row.appendChild(hiddenTile);
    };
    const blankSpace = 5 - i - player.landing[index].length;
    for (let j=blankSpace; j>0; j--) {
      const blankTileSpace = document.createElement('div');
      blankTileSpace.classList.add('blankTileSpace', 'tile');
      row.appendChild(blankTileSpace);
    };
    player.landing[index].forEach((stateLandingTile) => {
      const landingTile = document.createElement('div');
      landingTile.classList.add(`${stateLandingTile}`, 'tile');
      row.appendChild(landingTile);
    });
    element.appendChild(row);
  };
  return element;
};

console.log(createLanding(state.players[2]));
$playerSection.appendChild(createLanding(state.players[2]));

// createLimbo(state.players[2]);//////////////////////////////////////////////////////////////////////////////

/**
 * Occurs for each player upon start of game, and anytime a user input in the game happens. 
 * Creates a player's board html elements depending on their state.
 * @param {object}, the player that is being rendered
 */
const renderPlayerBoard = (player) => {
  const limbo = createLimbo(player);
  const landing = createLanding(player);
};
