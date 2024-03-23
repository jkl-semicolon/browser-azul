/**
 * &&&&&&&&&&&&&&&&&&&&       Web Browser Azul        &&&&&&&&&&&&&&&&&&&&
 * 
 * Simulates the popular board game Azul in your web browser.
 * BoardGameGeek entry: https://boardgamegeek.com/boardgame/230802/azul
 * 
 * - Single webpage play for 2-4 players in a hotseat format.
 * - Multiple webpage play for 2-4 players; requires a player host an API for game state.
 * - Header will contain buttons to start a 2-4 person hotseat game,
 *   or to start a 2-4 person multiple webpage game. Header will also
 *   contain a link to the rules and a reset button for the game.
 * 
 * UI Mock-up: https://excalidraw.com/#json=5A1Qs7M1Xwagbi-VdDQzO,4UbnZ3Pjpiu9dvg4_5PQuQ
 * 
 *          ###########       Pseudocode       ###########
 *          ## ---- for header & hotseat play only ---- ## 
 *          ##############################################
 *
 * 1. Render an empty game state upon the webpage loading.
 *   - Make sure that refreshing does not wipe the game state.
 * 2. Create a game state object.
 *   - The game state should include information on each player,
 *     their tiles and score, and tiles in the middle, discard, and bag.
 *   - The game state will also keep track of the number of players, 
 *     the current round, and if a game is currently being played.
 *   - The game state will have to accurately reflect where all tiles are
 *     while the game is being played.
 *   - The game state will contain individual player states.
 *      - Individual player boards will need to be stored in the game state.
 *      - The boards contain a 5x5 landing area for tiles that are
 *        already marked with the tiles it will accept.
 *      - The boards contain five row staging area, with the top row 
 *        having one staging tile space and the bottom row five spaces. 
 * 
 * 
 * 
 */