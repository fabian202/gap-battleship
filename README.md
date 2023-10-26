
# GAP Battleship Game

This is an online Battleship game built using Node.js, Express.js, and the express-ws package to enable WebSocket communication between players. It allows two players to play Battleship against each other in real-time.

## Features

-   Real-time Battleship game for two players.
-   WebSocket communication for live updates.
-   Dynamic board generation and ship placement.
-   WebSocket-based player moves and game state updates.

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js installed on your machine.
-   npm or yarn package manager.

## Installation

1.  Clone the repository:
    
    bashCopy code
    
    `git clone https://github.com/fabian202/gap-battleship.git
    cd gap-battleship` 
    
2.  Install dependencies:
    
    bashCopy code
    
    `npm install` 
    

## Usage

1.  Start the server:
    
    bashCopy code
    
    `npm start` 
    
2.  Open your web browser and access the game at `http://localhost:3000`.
    
3.  Share the game URL with your opponent.
    
4.  Play Battleship against your opponent in real-time.
    

## How to Play

-   The game is played on a 10x10 grid (1-10 rows, A-J columns).
-   Players take turns to click on the grid cells to make their moves.
-   Ships are placed randomly on the board with varying lengths.
-   The game continues until one player's ships are all sunk.


## Contributing

If you'd like to contribute to this project, please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch.
3.  Make your changes.
4.  Test your changes thoroughly.
5.  Create a pull request with a description of your changes.
