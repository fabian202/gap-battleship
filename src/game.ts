import {Room} from './interfaces/gameInterface';

const generatePlayerBoard = (): string[][] => {
  const matrix: string[][] = []

  for (let i = 0; i < 10; i++) {
    const row: string[] = []
    for (let j = 0; j < 10; j++) {
      row.push('')
    }
    matrix.push(row)
  }

  function isPositionValid(
    x: number,
    y: number,
    length: number,
    isHorizontal: boolean
  ): boolean {
    if (isHorizontal) {
      if (x + length > 10) {
        return false
      }
      for (let i = x; i < x + length; i++) {
        if (matrix[y][i] !== '') {
          return false
        }
        if (y > 0 && matrix[y - 1][i] !== '') {
          return false // Check above
        }
        if (y < 9 && matrix[y + 1][i] !== '') {
          return false // Check below
        }
        // Check left and right for the minimum distance
        if (
          (i > 0 && matrix[y][i - 1] !== '') ||
          (i < 9 && matrix[y][i + 1] !== '')
        ) {
          return false
        }
      }
    } else {
      if (y + length > 10) {
        return false
      }
      for (let i = y; i < y + length; i++) {
        if (matrix[i][x] !== '') {
          return false
        }
        if (x > 0 && matrix[i][x - 1] !== '') {
          return false // Check left
        }
        if (x < 9 && matrix[i][x + 1] !== '') {
          return false // Check right
        }
        // Check above and below for the minimum distance
        if (
          (i > 0 && matrix[i - 1][x] !== '') ||
          (i < 9 && matrix[i + 1][x] !== '')
        ) {
          return false
        }
      }
    }
    return true
  }

  // Function to place a ship at a given position
  function placeShip(
    x: number,
    y: number,
    length: number,
    isHorizontal: boolean
  ): void {
    if (isHorizontal) {
      for (let i = x; i < x + length; i++) {
        let position = 'm'
        if (x === i) position = 'f'
        if (i === x + length - 1) position = 'l'
        matrix[y][i] = `S|h|${position}`
      }
    } else {
      for (let i = y; i < y + length; i++) {
        let position = 'm'
        if (i === y) position = 'f'
        if (i === y + length - 1) position = 'l'
        matrix[i][x] = `S|v|${position}`
      }
    }
  }

  // Place 1 ship of two positions
  for (let i = 0; i < 1; i++) {
    let x: number, y: number, isHorizontal: boolean
    do {
      x = getRandomInt(0, 9)
      y = getRandomInt(0, 9)
      isHorizontal = getRandomInt(0, 1) === 0
    } while (!isPositionValid(x, y, 2, isHorizontal))
    placeShip(x, y, 2, isHorizontal)
  }

  // Place 2 ships of three positions
  for (let i = 0; i < 2; i++) {
    let x: number, y: number, isHorizontal: boolean
    do {
      x = getRandomInt(0, 9)
      y = getRandomInt(0, 9)
      isHorizontal = getRandomInt(0, 1) === 0
    } while (!isPositionValid(x, y, 3, isHorizontal))
    placeShip(x, y, 3, isHorizontal)
  }

  // Place 1 ship of four positions
  let x: number, y: number, isHorizontal: boolean
  do {
    x = getRandomInt(0, 9)
    y = getRandomInt(0, 9)
    isHorizontal = getRandomInt(0, 1) === 0
  } while (!isPositionValid(x, y, 4, isHorizontal))
  placeShip(x, y, 4, isHorizontal)

  // Place 1 ship of five positions
  do {
    x = getRandomInt(0, 9)
    y = getRandomInt(0, 9)
    isHorizontal = getRandomInt(0, 1) === 0
  } while (!isPositionValid(x, y, 5, isHorizontal))
  placeShip(x, y, 5, isHorizontal)

  return matrix
}

// Function to generate a random integer between min and max
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateEmptyBoard = (rows: number, columns: number): string[][] => {
  const board: string[][] = []

  for (let i = 0; i < rows; i++) {
    const row: string[] = []
    for (let j = 0; j < columns; j++) {
      row.push('')
    }
    board.push(row)
  }

  return board
}

const getTotalPlayersPerRoom = (
  rooms: Map<string, Room>
): { roomId: string; totalPlayers: number }[] => {
  return Array.from(rooms, ([roomId, room]) => ({
    roomId,
    totalPlayers: room.players.length,
    hitsP1: room?.players[0]?.hits,
    hitsP2: room?.players[1]?.hits
  }))
}

export { generatePlayerBoard, generateEmptyBoard, getTotalPlayersPerRoom }
