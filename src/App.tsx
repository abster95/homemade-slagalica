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
import { SpojniceGameMaster } from './features/spojnice/SpojniceGameMaster'
import { SpojnicePlay } from './features/spojnice/SpojnicePlay'
import { SpojniceGameState } from './features/spojnice/types'
import { saveConfigToFile, loadConfigFromFile, AllGamesConfig } from './utils/fileUtils'

type GameType = 'slagalica' | 'asocijacije' | 'moj-broj' | 'skocko' | 'spojnice' | null

function App() {
  const [mode, setMode] = useState<'menu' | 'game-master' | 'play'>('menu')
  const [selectedGame, setSelectedGame] = useState<GameType>(null)
  const [slagalicaConfig, setSlagalicaConfig] = useState<SlagalicaGameState | null>(null)
  const [asocijacijeConfig, setAsocijacijeConfig] = useState<AsocijacijeGameState | null>(null)
  const [mojBrojConfig, setMojBrojConfig] = useState<MojBrojGameState | null>(null)
  const [skockoConfig, setSkockoConfig] = useState<SkockoGameState | null>(null)
  const [spojniceConfig, setSpojniceConfig] = useState<SpojniceGameState | null>(null)

  const handleSaveConfig = () => {
    const config: AllGamesConfig = {
      version: '1.0.0',
      slagalica: slagalicaConfig,
      asocijacije: asocijacijeConfig,
      mojBroj: mojBrojConfig,
      skocko: skockoConfig,
      spojnice: spojniceConfig,
    }
    saveConfigToFile(config)
  }

  const handleLoadConfig = async () => {
    try {
      const config = await loadConfigFromFile()

      // Load each game configuration if it exists
      if (config.slagalica) setSlagalicaConfig(config.slagalica)
      if (config.asocijacije) setAsocijacijeConfig(config.asocijacije)
      if (config.mojBroj) setMojBrojConfig(config.mojBroj)
      if (config.skocko) setSkockoConfig(config.skocko)
      if (config.spojnice) setSpojniceConfig(config.spojnice)

      alert('Configuration loaded successfully!')
    } catch (error) {
      alert(`Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

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
                {slagalicaConfig && ' ✓'}
              </button>
              <button onClick={() => setSelectedGame('asocijacije')}>
                Asocijacije (Associations)
                {asocijacijeConfig && ' ✓'}
              </button>
              <button onClick={() => setSelectedGame('moj-broj')}>
                Moj Broj (My Number)
                {mojBrojConfig && ' ✓'}
              </button>
              <button onClick={() => setSelectedGame('skocko')}>
                Skočko (Mastermind)
                {skockoConfig && ' ✓'}
              </button>
              <button onClick={() => setSelectedGame('spojnice')}>
                Spojnice (Connections)
                {spojniceConfig && ' ✓'}
              </button>
            </div>

            <div className="config-management">
              <h3>Configuration Management</h3>
              <div className="menu-buttons">
                <button onClick={handleSaveConfig}>
                  💾 Save All Games to File
                </button>
                <button onClick={handleLoadConfig}>
                  📂 Load All Games from File
                </button>
              </div>
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

        {mode === 'game-master' && selectedGame === 'spojnice' && (
          <SpojniceGameMaster
            onSave={(config) => {
              setSpojniceConfig(config)
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
            {!slagalicaConfig && !asocijacijeConfig && !mojBrojConfig && !skockoConfig && !spojniceConfig && (
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
              <button
                onClick={() => setSelectedGame('spojnice')}
                disabled={!spojniceConfig}
              >
                Spojnice (Connections)
                {spojniceConfig && ' ✓'}
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

        {mode === 'play' && selectedGame === 'spojnice' && spojniceConfig && (
          <SpojnicePlay
            gameConfig={spojniceConfig}
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
