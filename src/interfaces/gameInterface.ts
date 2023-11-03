// Define types for the player data and the room
export type PlayerData = {
  ws: any;
  playerBoard: string[][]; // Adjust this to your actual board data type
  enemyBoard: string[][]; // Adjust this to your actual board data type
  player: number;
  hits: number;
};

export type Room = {
  players: PlayerData[];
  turn: number;
};
