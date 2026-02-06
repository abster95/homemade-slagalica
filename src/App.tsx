import { useState } from 'react'
import './App.css'
import { SlagalicaGameMaster } from './features/slagalica/SlagalicaGameMaster'
import { SlagalicaPlay } from './features/slagalica/SlagalicaPlay'
import { SlagalicaGameState } from './features/slagalica/types'
import { AsocijacijeGameMaster } from './features/asocijacije/AsocijacijeGameMaster'
import { AsocijacijePlay } from './features/asocijacije/AsocijacijePlay'
import { AsocijacijeGameState } from './features/asocijacije/types'

type GameType = 'slagalica' | 'asocijacije' | null

function App() {
  const [mode, setMode] = useState<'menu' | 'game-master' | 'play'>('menu')
  const [selectedGame, setSelectedGame] = useState<GameType>(null)
  const [slagalicaConfig, setSlagalicaConfig] = useState<SlagalicaGameState | null>(null)
  const [asocijacijeConfig, setAsocijacijeConfig] = useState<AsocijacijeGameState | null>(null)

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

        {mode === 'game-master' && !selectedGame && (
          <div className="game-master-mode">
            <h2>Game Master Mode</h2>
            <p>Select a game to configure</p>
            <div className="menu-buttons">
              <button onClick={() => setSelectedGame('slagalica')}>
                Slagalica (Word Puzzle)
              </button>
              <button onClick={() => setSelectedGame('asocijacije')}>
                Asocijacije (Associations)
              </button>
            </div>
            <button onClick={() => setMode('menu')}>Back to Menu</button>
          </div>
        )}

        {mode === 'game-master' && selectedGame === 'slagalica' && (
          <SlagalicaGameMaster
            onSave={(config) => {
              setSlagalicaConfig(config)
              setSelectedGame(null)
              setMode('menu')
            }}
            onBack={() => setSelectedGame(null)}
          />
        )}

        {mode === 'game-master' && selectedGame === 'asocijacije' && (
          <AsocijacijeGameMaster
            onSave={(config) => {
              setAsocijacijeConfig(config)
              setSelectedGame(null)
              setMode('menu')
            }}
            onBack={() => setSelectedGame(null)}
          />
        )}

        {mode === 'play' && !selectedGame && (
          <div className="play-mode">
            <h2>Play Mode</h2>
            <p>Select a game to play</p>
            {!slagalicaConfig && !asocijacijeConfig && (
              <p className="warning">⚠️ No games configured yet. Use Game Master Mode first.</p>
            )}
            <div className="menu-buttons">
              <button
                onClick={() => setSelectedGame('slagalica')}
                disabled={!slagalicaConfig}
              >
                Slagalica (Word Puzzle)
                {slagalicaConfig && ' ✓'}
              </button>
              <button
                onClick={() => setSelectedGame('asocijacije')}
                disabled={!asocijacijeConfig}
              >
                Asocijacije (Associations)
                {asocijacijeConfig && ' ✓'}
              </button>
            </div>
            <button onClick={() => setMode('menu')}>Back to Menu</button>
          </div>
        )}

        {mode === 'play' && selectedGame === 'slagalica' && slagalicaConfig && (
          <SlagalicaPlay
            gameConfig={slagalicaConfig}
            onBack={() => {
              setSelectedGame(null)
              setMode('menu')
            }}
          />
        )}

        {mode === 'play' && selectedGame === 'asocijacije' && asocijacijeConfig && (
          <AsocijacijePlay
            gameConfig={asocijacijeConfig}
            onBack={() => {
              setSelectedGame(null)
              setMode('menu')
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
