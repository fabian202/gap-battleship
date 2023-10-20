const GAME_STATE = {
  player: 0,
  turn: 1,
  hits: 0,
}

const handleOnMessage = ({ data: message }) => {
  const { action, data } = JSON.parse(message)

  const gameStatus = document.getElementById('gameStatus')

  switch (action) {
    case 'playerBoardUpdate':
      const { playerBoard, enemyBoard, player, turn } = data
      //Render my board
      const playerTable = document.getElementById('playerBoard')
      playerTable.innerHTML = renderBoard(playerBoard, false)
      //render Enemy board
      const enemyTable = document.getElementById('enemyBoard')
      enemyTable.innerHTML = renderBoard(enemyBoard, turn === player, true)

      //Update game state
      GAME_STATE.player = player
      GAME_STATE.turn = turn

      if (turn) {
        gameStatus.innerHTML = turn === player ? 'Your Turn' : `Rival's Turn`
      }

      break
    case 'playerJoined':
      gameStatus.innerHTML = 'Your Turn'
      break
    case 'roomsUpdate':
      const { rooms } = data

      const roomList = document.getElementById('roomList')
      console.log(rooms)
      rooms.forEach((room, ix) => {
        const li = document.createElement('li')
        if (room.totalPlayers === 1) {
          const roomLink = document.createElement('a')
          roomLink.href = `/${room.roomId}` // Set the link to the room ID
          roomLink.textContent = `Room #${ix + 1}`
          li.appendChild(roomLink)
          li.innerHTML += ` (${room.totalPlayers}/2 users)`
          roomList.appendChild(li)
        } else {
          li.innerHTML += `Room #${ix + 1} (${room.totalPlayers}/2 users)`
          roomList.appendChild(li)
        }
      })
      break
    default:
      break
  }
}

const handleOnOpen = () => {
  const message = { action: 'open' }
  socket.send(JSON.stringify(message))
}

// Function to render the board based on the matrix
function renderBoard(matrix, clickable, isEnemy) {
  let board =
    '<table class="table custom-table" disabled>' +
    '<thead>' +
    '<tr>' +
    '<th></th>' +
    '<th>A</th>' +
    '<th>B</th>' +
    '<th>C</th>' +
    '<th>D</th>' +
    '<th>E</th>' +
    '<th>F</th>' +
    '<th>G</th>' +
    '<th>H</th>' +
    '<th>I</th>' +
    '<th>J</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>'
  for (let i = 1; i <= 10; i++) {
    board += '<tr>'
    board += '<td>' + i + '</td>'
    for (let j = 0; j < 10; j++) {
      const columnLetter = String.fromCharCode(65 + j)
      const cellId = columnLetter + i
      let cellContent = matrix[i - 1][j]
      const [content, direction, index] = cellContent.split('|')

      // Map matrix values to CSS classes
      if (content === 'H') {
        // Display 'X' for hits
        const className = direction ? `hit-${direction}-${index}` : ''
        board += isEnemy
          ? `<td id="${cellId}" class="table-cell hit disabled">X</td>`
          : `<td id="${cellId}" class="table-cell ${className}">X</td>`
        // '<td id="' +
        // cellId +
        // '" class="table-cell hit">X</td>'
      } else if (content === 'M') {
        // Display 'O' for misses
        board +=
          '<td id="' + cellId + '" class="table-cell miss disabled">O</td>'
      } else {
        const className = direction ? `ship-${direction}-${index}` : ''
        if (clickable) {
          board += `<td id="${cellId}" class="table-cell ${className}" onclick="handleClick(this)">${content}</td>`
        } else {
          board += `<td id="${cellId}" class="table-cell disabled ${className}">${content}</td>`
        }
      }
    }
    board += '</tr>'
  }
  return (board += '</tbody></table>')
}

function handleClick(cell) {
  const cellId = cell.id
  const column = cellId.charCodeAt(0) - 65 // Convert column letter to index
  const row = parseInt(cellId.substring(1)) - 1 // Convert row number to index
  const message = {
    action: 'click',
    payload: { column, row, player: GAME_STATE.player },
  }
  socket.send(JSON.stringify(message))
}

const getUrl = () => {
  // Get the current page's URL
  const currentURL = window.location.href

  // Extract the protocol (http or https) and host (including port) from the URL
  const urlParts = currentURL.match(/^(\w+):\/\/([^\s/]+)([^#?]*)/)

  if (urlParts) {
    const protocol = urlParts[1] === 'https' ? 'wss' : 'ws'
    const host = urlParts[2]

    // Define the path for the WebSocket connection
    const path = '/game' // Update this with your WebSocket path

    // Construct the WebSocket URL
    return `${protocol}://${host}${path}`
  } else {
    console.error('Unable to determine the WebSocket URL.')
  }
}
