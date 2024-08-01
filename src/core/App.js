import React from "react";
import { useState } from "react";
import '../css/App.css';
import { Client } from "boardgame.io/react";
import { Debug } from "boardgame.io/debug"
import { ItemShop } from "../shopComponents/shop";
import Game from "./Game"
import { runGameLoop } from "./gameLogic";
import { PLAYER_ONE, PLAYER_TWO, RESULT } from "../data/constants";
import BattleDebug from "../debugComponents/BattleDebug";



const Main = (props) => {
  const [page1, setPage1] = useState(true)
  const nextPage = () => setPage1(!page1)
  const { G, moves, events } = props

  function runGame() {
    const { playerResult, gameLog } = runGameLoop({ [PLAYER_ONE]: G.roster, [PLAYER_TWO]: G.P2 }, G.bags, G.gymLevel)
    moves.setGameLog(gameLog)
    moves.setPlayerResult(playerResult)
    moves.getNewOpponent()
    moves.setNewWildCard()
    moves.setNewShop()
    moves.addGold(5)
    if (playerResult === RESULT.WIN) {
      moves.increaseShopLevel()
      moves.addGold(3)
    }

    nextPage()
  }

  function isEndGame() {
    if (G.playerResult === RESULT.LOSE) {
      events.endGame()
      alert("YOU LOSE. REFRESH PAGE.")
    }
    nextPage()
  }



  return page1 ? <ItemShop {...props} _nextPage={runGame} /> : <BattleDebug {...props} _nextPage={isEndGame} />
}

const App = Client({
  game: Game,
  board: Main,
  debug: false
});

export default App