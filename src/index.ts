import express from 'express'
import expressWs from 'express-ws'
import { engine } from 'express-handlebars'
import path from 'path'
import { generatePlayerBoard, generateEmptyBoard, getTotalPlayersPerRoom } from './game'
import { Room, PlayerData } from './interfaces/gameInterface'

const app = express()
const port = process.env.PORT || 3000

const { app: wsApp } = expressWs(app)

// Configure Handlebars as the view engine
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'assets')))
app.set('views', path.join(__dirname, 'views'))

const rooms = new Map<string, Room>()
const guests: any[] = []

wsApp.ws('/websocket', (ws) => {
  ws.on('message', (message: string) => {
    ws.send(`Received: ${message}`)
  })
})

wsApp.ws('/game', (ws: any) => {
  ws.on('message', (message: string) => {
    guests.push(ws)
    //send the rooms
    const roomIds = Array.from(rooms.keys())
    const guestMessage = {
      action: 'roomsUpdate',
      data: {
        rooms: getTotalPlayersPerRoom(rooms)
      }
    }
    ws.send(JSON.stringify(guestMessage))
  })
})

wsApp.ws('/game/:roomID', (ws, req) => {
  const roomID = req.params.roomID

  ws.on('message', (message: string) => {
    const room = rooms.get(roomID)
    const playerBoard = generatePlayerBoard()
    const enemyBoard = generateEmptyBoard(10, 10)
    const messageData = JSON.parse(message)
    switch (messageData.action) {
      case 'open':
        if (!room) {
          //Crete new room with player 1
          const playerData: PlayerData = {
            ws,
            playerBoard,
            enemyBoard,
            player: 1,
            hits: 0,
          }
          rooms.set(roomID, {
            players: [playerData],
            turn: 1,
          })

          const message = {
            action: 'playerBoardUpdate',
            data: {
              playerBoard,
              enemyBoard,
              player: playerData.player,
              turn: 0,
            },
          }

          ws.send(JSON.stringify(message))
          //Send board to player
        } else if (room && room.players.length < 2) {
          //Player 2 joins the room
          const enemyData: PlayerData = {
            ws,
            playerBoard,
            enemyBoard,
            player: 2,
            hits: 0,
          }
          room.players.push(enemyData)
          room.turn = 1

          const message = {
            action: 'playerBoardUpdate',
            data: {
              playerBoard,
              enemyBoard,
              player: enemyData.player,
              turn: 1,
            },
          }

          ws.send(JSON.stringify(message))

          //Notify player 1
          const player1 = room!.players.find((pl) => pl.player === 1)
          const notifyMessage = {
            action: 'playerBoardUpdate',
            data: {
              playerBoard: player1?.playerBoard,
              enemyBoard: player1?.enemyBoard,
              player: 1,
              turn: 1,
            },
          }
          player1!.ws.send(JSON.stringify(notifyMessage))

          //Notify guest
          const guestMessage = {
            action: 'roomsUpdate',
            data: {
              rooms: getTotalPlayersPerRoom(rooms)
            }
          }
          guests.forEach((guest) => {
            guest.send(JSON.stringify(guestMessage))
          })
        } else {
          //room full watch mode
          console.log('full room')
          return
        }
        break
      case 'click':
        const {
          column,
          row,
          player,
        }: { column: number; row: number; player: number } = messageData.payload
        // console.log('click', roomID, room)
        // Change turn
        room!.turn = room!.turn === 1 ? 2 : 1
        room?.players.forEach((p) => {
          if (p.player !== player) {
            const [matValue, position, index] = p.playerBoard[row][
              column
            ].split('|')
            const activePlayer = room!.players.find(
              (pl) => pl.player === player
            )

            if (matValue === 'S') {
              //Register a Hit
              p.playerBoard[row][column] = `H|${position}|${index}`
              activePlayer!.enemyBoard[row][column] = `H|${position}|${index}`

              //Increase the hit counter
              activePlayer!.hits++
            } else {
              //register Miss
              p.playerBoard[row][column] = 'M'
              activePlayer!.enemyBoard[row][column] = 'M'
            }
            //Send the hit to the player playerBoardUpdate
            const message = {
              action: 'playerBoardUpdate',
              data: {
                playerBoard: p.playerBoard,
                enemyBoard: p.enemyBoard,
                player: p.player,
                turn: room!.turn,
              },
            }
            p.ws.send(JSON.stringify(message))

            const enemyMessage = {
              action: 'playerBoardUpdate',
              data: {
                playerBoard: activePlayer!.playerBoard,
                enemyBoard: activePlayer!.enemyBoard,
                player: activePlayer!.player,
                turn: room!.turn,
              },
            }
            activePlayer!.ws.send(JSON.stringify(enemyMessage))

            //Check if the player won
            if (activePlayer!.hits === 17) {
              const gameOverMessage = {
                action: 'gameOver',
                data: {
                  player: activePlayer!.player,
                },
              }

              //Send message to both players
              activePlayer!.ws.send(JSON.stringify(gameOverMessage))
              p.ws.send(JSON.stringify(gameOverMessage))
            }
          }
        })

        break
      default:
        break
    }
  })
})

app.get('/', (req, res) => {
  res.render('welcome')
})

app.get('/:roomID', (req, res) => {
  const roomID = req.params.roomID
  res.render('websocket', { roomID }) // Render the Handlebars template
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
