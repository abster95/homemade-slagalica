import { useState } from 'react'
import './App.css'
import { SlagalicaGameMaster } from './features/slagalica/SlagalicaGameMaster'
import { SlagalicaPlay } from './features/slagalica/SlagalicaPlay'
import { SlagalicaGameState } from './features/slagalica/types'
import { AsocijacijeGameMaster } from './features/asocijacije/AsocijacijeGameMaster'
import { AsocijacijePlay } from './features/asocijacije/AsocijacijePlay'
import { AsocijacijeGameState } from './features/asocijacije/types'
import { MojBrojGameMaster } from './features/moj-broj/MojBrojGameMaster'
import { MojBrojPlay } from './features/moj-broj/MojBrojPlay'
import { MojBrojGameState } from './features/moj-broj/types'
import { SkockoGameMaster } from './features/skocko/SkockoGameMaster'
import { SkockoPlay } from './features/skocko/SkockoPlay'
import { SkockoGameState } from './features/skocko/types'

type GameType = 'slagalica' | 'asocijacije' | 'moj-broj' | 'skocko' | null

function App() {
  const [mode, setMode] = useState<'menu' | 'game-master' | 'play'>('menu')
  const [selectedGame, setSelectedGame] = useState<GameType>(null)
  const [slagalicaConfig, setSlagalicaConfig] = useState<SlagalicaGameState | null>(null)
  const [asocijacijeConfig, setAsocijacijeConfig] = useState<AsocijacijeGameState | null>(null)
  const [mojBrojConfig, setMojBrojConfig] = useState<MojBrojGameState | null>(null)
  const [skockoConfig, setSkockoConfig] = useState<SkockoGameState | null>(null)

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
              <button onClick={() => setSelectedGame('moj-broj')}>
                Moj Broj (My Number)
              </button>
              <button onClick={() => setSelectedGame('skocko')}>
                Skočko (Mastermind)
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

        {mode === 'game-master' && selectedGame === 'moj-broj' && (
          <MojBrojGameMaster
            onSave={(config) => {
              setMojBrojConfig(config)
              setSelectedGame(null)
              setMode('menu')
            }}
            onBack={() => setSelectedGame(null)}
          />
        )}

        {mode === 'game-master' && selectedGame === 'skocko' && (
          <SkockoGameMaster
            onSave={(config) => {
              setSkockoConfig(config)
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
            {!slagalicaConfig && !asocijacijeConfig && !mojBrojConfig && !skockoConfig && (
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
              <button
                onClick={() => setSelectedGame('moj-broj')}
                disabled={!mojBrojConfig}
              >
                Moj Broj (My Number)
                {mojBrojConfig && ' ✓'}
              </button>
              <button
                onClick={() => setSelectedGame('skocko')}
                disabled={!skockoConfig}
              >
                Skočko (Mastermind)
                {skockoConfig && ' ✓'}
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

        {mode === 'play' && selectedGame === 'moj-broj' && mojBrojConfig && (
          <MojBrojPlay
            gameConfig={mojBrojConfig}
            onBack={() => {
              setSelectedGame(null)
              setMode('menu')
            }}
          />
        )}

        {mode === 'play' && selectedGame === 'skocko' && skockoConfig && (
          <SkockoPlay
            gameConfig={skockoConfig}
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
