# Tile Swipe
> A 2048-style merging game

## authorship
- Julie Tucker
- [GitHub Link](https://github.com/julie-tucker/dev-charlie-tile-swipe)
- 10 - 13 - 2026
- version 1.0

## user story 
- **as a** person who loves the game 2048 
- **i want** to create a similar game
- **so that** other people can enjoy it

## narrative
This is a 2048 style game that has 2 versions. A human coded version and an AI + human coded verson. Both versions are similar but the full version has more features!

> Use the arrow keys to move tiles and combine them. Try to beat your high score!

## about the app
Tile Swipe is a browser-based puzzle game where players slide numbered tiles around a 4 × 4 board. Matching tiles combine into larger numbers, and each merge increases the score. The goal is to reach the 2048 tile while trying to achieve a high score.

The full version includes player name entry, guest mode, score tracking, a personal best, a leaderboard, undo, hints, and reset options.

### Wireframe + issue ideas links
- [Issue Ideas Links](https://github.com/julie-tucker/dev-charlie-tile-swipe/issues)
- [Wireframe Link](https://github.com/julie-tucker/dev-charlie-tile-swipe/wiki/Wireframe)

### Directory Tree
```
C:.
|   dev_charlie_wireframe
|   index.html
|   README.md
|   
+---.vscode
|       settings.json
|       
+---assets
|   +---css
|   |       full-game.css
|   |       styles.css
|   |       
|   \---js
|           concept.js
|           full.js
|           
\---pages
        .lucid
        concept.html
        full.html
```
### Tech and tools used
- HTML
- CSS
- JavaScript
- Bootstrap 5
- jQuery
- Visual Studio Code
- Git and GitHub
- Chat GPT
- GrokAI

### Code snippet

> This piece of code from concept.js that checks when the user wins the game. It is set to end the game when the user reaches a 64 tile. However,  you can change the number in the if statement to make the game easier or harder.
```
// check for win
function checkWin() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 64) { //change this number to make game easier or harder
        return true;
      }
    }
  }
  return false;
}
```

### links & reports using Nu & Lighthouse


### finally, create & link to sprint 99/future ideas
  - create a milestone: sprint 99
  - create at least 3 issues for future ideas & label them as sprint 99 milestone 
