/**
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
* 	1.	A user can press a button to host a room for a game. They would start a server listening for 
* 			GET and PUT routes to '/'
* 	2.	Other users can check for a game being hosted, and join that room.
* 	3.	The host can press a button to start the game with the players in the room; either 2, 3, or 4 people.
* 	4.	The state object for the game will be stored in server, and be passed to players upon the completion of a player's
* 			action. The active player makes PUT requests to the server to update state upon the end of a player action.
* 		a. 	Player's screen will all re-render upon receiving state object.
* 	5.	Play will continue until the game ends.
*/

/**
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
*    iii.A dotted red border appears around the eligible rows in the landing area for the limbo tiles
*        to be placed. The player will choose which row the limbo tiles will go.
*      ~ The player can also choose no row, in which tiles go to the broken area.
*      ~ The row chosen must either be empty, or if there are tiles already present, the color of them must 
*        match the tiles in limbo.
       ~ Overflow tiles in a row will go to the broken area.
        ~ If the broken area is filled, tiles go to the discard.
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
*/
