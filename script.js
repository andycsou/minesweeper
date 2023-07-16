//  Display/U1


import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 16


const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector("[data-mine-count")
const messageText = document.querySelector('.subtext')

//console.log(board)

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () => {
            revealTile(board, tile)
            checkGameEnd()
        })
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markTilesCount = board.reduce((count, row) => {
        return (
            count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
        
    }, 0)
    minesLeftText.textContent = NUMBER_OF_MINES - markTilesCount
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, {capture: true})
        boardElement.addEventListener("contextmenu", stopProp, {capture: true})
    }

    if (win) {
        messageText.textContent = 'You Won'
    }

    if (lose) {
        messageText.textContent = 'You Lose'
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) {
                    markTile(tile)
                }
                if (tile.mine) {
                    revealTile(board, tile)
                }
            })
        })
    }

}

function stopProp(e) {
    e.stopImmediatePropagation()
}

// Populate a board with tiles/mines
// Left click on tiles
// a. Reveal tiles
// Right click on tiles
// a. Mark tiles
// Check for win/ lose
