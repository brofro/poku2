import React from "react";
import { useState, useEffect } from "react";
import './App.css';
import { Client } from "boardgame.io/react";
import { Debug } from "boardgame.io/debug"
import { ItemShop } from "../components/shop";
import Game from "./Game"
import BattleDebug from "../components/BattleDebug";



const Main = (props) => {
  const [page1, setPage1] = useState(true)
  const nextPage = () => setPage1(!page1)

  return page1 ? <ItemShop {...props} _nextPage={nextPage} /> : <BattleDebug {...props} _nextPage={nextPage} />
}

const App = Client({
  game: Game,
  board: Main,
  debug: { impl: Debug },
});

export default App