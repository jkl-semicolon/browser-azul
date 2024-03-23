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
 *          ## ---- for header & hotseat play only ---- ## 
 *          ##############################################
 *
 * 1. The header will show a picture of the game box, and have two
 *    sets of buttons, for 2P, 3P, 4P hotseat game and
 *    2P, 3P, 4P multiple browser game. There will also be an 
 *    external link to the rules and a button to reset the game.
 *   - Make sure that refreshing does not wipe the game state.
 * 2. Create a game state object.
 *   - The game state will contain individual player states.
 *      - Individual player boards will need to be stored in the game state.
 *      - The boards contain a 5x5 landing area for tiles that are
 *        already marked with the tiles it will accept.
 *      - The boards contain five row staging area, with the top row 
 *        having one staging tile space and the bottom row five spaces. 
 *      - The boards contain a one row broken tile area, with the negative
 *        point values running from [-1,-1,-2,-2,-2,-3,-3].
 *      - Player state will also keep track of the player score.
 *    - In a new round, the state in the middle of the board will reset and
 *      contain 5, 7, or 9 factory tiles, each with 4 tiles of 5 different colors.
 *      - There will also be a 1st player tile in the middle of the factory tiles.
 *    - The game state will have to accurately reflect where all tiles are
 *      while the game is being played.
 *    - There are 100 tiles, 20 each of 5 different colors. There is also the unique
 *      first player tile. Their locations can either be in the bag, in the middle 
 *      (if in middle, can be on factory tile or not on factory tile), with a player 
 *      (if with player, either in limbo, staging area, landing area, or broken area),
 *      or in the discard. Once bag is empty, discard will repopulate into bag.
 *    - Game state will also keep track of if there is a game going on, the number of players,
 *      who the active player is (for hotseat view purposes), the current player order, and the player
 *      order for next round.
 * 3. Once loaded into the webpage, the user can either choose to start a new game or read the rules.
 *   - User sees placeholder text/art/images in lieu of the other player area, middle area, and player area.
 * 4. After clicking start for 2P, 3P, or 4P, the number of factory discs will be set, and a player order is chosen.
 *   - Main area populates with tiles, and players see their empty play areas and scores.
 *   - Current player will click on a tile in the middle to take, and all colors in that area will go 
 *     to current player's limbo. 1st player tile is also taken if it is in the middle when player chooses middle.
 *    - If player takes 1st player token, they are set to be 1st player next round.
 *   - While in limbo, player chooses which staging row to place tiles. Some tiles may fall into
 *     broken tile area at this time.
 *   - Play passes to next player, and tiles continue to be chosen until none are left.
 *   - Play moves to landing phase, and all players see their scores change and potential tiles move
 *     from staging area to landing area. After score calculation, all tiles not on landing area are discarded.
 *   - Game checks for if game is over (if someone's landing area has a completed row).
 *     If not, start a new round by repopulating factory tiles, and refilling bag with discard pile if needed.
 *   - If game end, add in game end bonuses to player scores and announce winning player. Game state will then reset.
 * 5. If reset button is clicked, warning message will ensue. If ignored, reset game state to how it was upon
 *    webpage's initial loading.
 * 
 *          ###########       Pseudocode       ###########
 *          ## ----- for game and game state flow ----- ## 
 *          ##############################################
 * 
 * 1. Game starts.
 *  a.  Set factory tile number, number of players, and player order. 
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
 *    iii.A dotted red border appears around the eligible rows for the limbo tiles
 *        to be placed. The 
 * 
 */

