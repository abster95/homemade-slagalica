import { useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState<'menu' | 'game-master' | 'play'>('menu')

  return (
    <div className="app">
      <header>
        <h1>Slagalica</h1>
      </header>

      <main>
        {mode === 'menu' && (
          <div className="menu">
            <h2>Welcome to Slagalica!</h2>
            <p>Serbian Quiz Game</p>
            <div className="menu-buttons">
              <button onClick={() => setMode('game-master')}>
                Game Master Mode
              </button>
              <button onClick={() => setMode('play')}>
                Play Mode
              </button>
            </div>
          </div>
        )}

        {mode === 'game-master' && (
          <div className="game-master-mode">
            <h2>Game Master Mode</h2>
            <p>Set up game parameters and clues</p>
            <button onClick={() => setMode('menu')}>Back to Menu</button>
          </div>
        )}

        {mode === 'play' && (
          <div className="play-mode">
            <h2>Play Mode</h2>
            <p>Select a game to play</p>
            <button onClick={() => setMode('menu')}>Back to Menu</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
