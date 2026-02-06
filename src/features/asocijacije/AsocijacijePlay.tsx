import { useState, useEffect } from 'react'
import { AsocijacijeGameState, ColumnState } from './types'
import './AsocijacijePlay.css'

interface AsocijacijePlayProps {
  gameConfig: AsocijacijeGameState
  onBack: () => void
}

type ColumnName = 'A' | 'B' | 'C' | 'D'

export function AsocijacijePlay({ gameConfig, onBack }: AsocijacijePlayProps) {
  const [timeElapsed, setTimeElapsed] = useState(180) // 3 minutes = 180 seconds
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)

  const [columnAState, setColumnAState] = useState<ColumnState>({
    field1Revealed: false,
    field2Revealed: false,
    field3Revealed: false,
    field4Revealed: false,
    solutionRevealed: false,
  })

  const [columnBState, setColumnBState] = useState<ColumnState>({
    field1Revealed: false,
    field2Revealed: false,
    field3Revealed: false,
    field4Revealed: false,
    solutionRevealed: false,
  })

  const [columnCState, setColumnCState] = useState<ColumnState>({
    field1Revealed: false,
    field2Revealed: false,
    field3Revealed: false,
    field4Revealed: false,
    solutionRevealed: false,
  })

  const [columnDState, setColumnDState] = useState<ColumnState>({
    field1Revealed: false,
    field2Revealed: false,
    field3Revealed: false,
    field4Revealed: false,
    solutionRevealed: false,
  })

  const [finalSolutionRevealed, setFinalSolutionRevealed] = useState(false)

  const [guessInput, setGuessInput] = useState('')
  const [guessType, setGuessType] = useState<'none' | 'columnA' | 'columnB' | 'columnC' | 'columnD' | 'final'>('none')
  const [boxOpenedThisTurn, setBoxOpenedThisTurn] = useState(false)

  // Track which player solved each column (0 = unsolved, 1 = player 1, 2 = player 2)
  const [columnASolver, setColumnASolver] = useState<0 | 1 | 2>(0)
  const [columnBSolver, setColumnBSolver] = useState<0 | 1 | 2>(0)
  const [columnCSolver, setColumnCSolver] = useState<0 | 1 | 2>(0)
  const [columnDSolver, setColumnDSolver] = useState<0 | 1 | 2>(0)

  // Timer effect
  useEffect(() => {
    if (gameEnded) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev <= 1) {
          setGameEnded(true)
          revealAllFields()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameEnded])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getColumnState = (column: ColumnName): ColumnState => {
    switch (column) {
      case 'A': return columnAState
      case 'B': return columnBState
      case 'C': return columnCState
      case 'D': return columnDState
    }
  }

  const setColumnState = (column: ColumnName, state: ColumnState) => {
    switch (column) {
      case 'A': setColumnAState(state); break
      case 'B': setColumnBState(state); break
      case 'C': setColumnCState(state); break
      case 'D': setColumnDState(state); break
    }
  }

  const getColumnData = (column: ColumnName) => {
    switch (column) {
      case 'A': return gameConfig.columnA
      case 'B': return gameConfig.columnB
      case 'C': return gameConfig.columnC
      case 'D': return gameConfig.columnD
    }
  }

  const handleFieldClick = (column: ColumnName, field: 1 | 2 | 3 | 4) => {
    if (gameEnded) return
    if (boxOpenedThisTurn) return // Only allow one box per turn

    const state = getColumnState(column)
    const fieldKey = `field${field}Revealed` as keyof ColumnState

    // Don't reveal if already revealed or if it's a solution field
    if (state[fieldKey] || state.solutionRevealed) return

    // Reveal the field
    setColumnState(column, { ...state, [fieldKey]: true })
    setBoxOpenedThisTurn(true)
  }

  const countRevealedFields = (column: ColumnName): number => {
    const state = getColumnState(column)
    let count = 0
    if (state.field1Revealed) count++
    if (state.field2Revealed) count++
    if (state.field3Revealed) count++
    if (state.field4Revealed) count++
    return count
  }

  const hasAnyFieldRevealed = (column: ColumnName): boolean => {
    return countRevealedFields(column) > 0
  }

  const handleGuessColumn = (column: ColumnName) => {
    if (gameEnded) return
    if (!hasAnyFieldRevealed(column)) return
    if (getColumnState(column).solutionRevealed) return

    setGuessType(`column${column}`)
    setGuessInput('')
  }

  const handleGuessFinal = () => {
    if (gameEnded) return
    if (!boxOpenedThisTurn) return // Must open a box before guessing
    setGuessType('final')
    setGuessInput('')
  }

  const handleSubmitGuess = () => {
    if (guessType === 'none') return

    if (guessType === 'final') {
      const correct = guessInput.trim().toLowerCase() === gameConfig.finalSolution.trim().toLowerCase()
      if (correct) {
        setFinalSolutionRevealed(true)

        // Count how many columns are already solved
        const solvedColumns = [columnASolver, columnBSolver, columnCSolver, columnDSolver].filter(s => s !== 0).length

        // Award points: 50 - 10 × number of solved columns
        const points = 50 - (10 * solvedColumns)
        if (currentPlayer === 1) {
          setPlayer1Score(prev => prev + points)
        } else {
          setPlayer2Score(prev => prev + points)
        }

        // Color all unsolved columns in current player's color
        if (columnASolver === 0) setColumnASolver(currentPlayer)
        if (columnBSolver === 0) setColumnBSolver(currentPlayer)
        if (columnCSolver === 0) setColumnCSolver(currentPlayer)
        if (columnDSolver === 0) setColumnDSolver(currentPlayer)

        setGameEnded(true)
        revealAllFields()
      } else {
        // Wrong guess - switch player
        switchPlayer()
      }
    } else {
      // Column guess
      const column = guessType.replace('column', '') as ColumnName
      const columnData = getColumnData(column)
      const correct = guessInput.trim().toLowerCase() === columnData.solution.trim().toLowerCase()

      if (correct) {
        const revealedCount = countRevealedFields(column)
        const points = 12 - (2 * revealedCount)

        // Award points
        if (currentPlayer === 1) {
          setPlayer1Score(prev => prev + points)
        } else {
          setPlayer2Score(prev => prev + points)
        }

        // Track which player solved this column
        switch (column) {
          case 'A': setColumnASolver(currentPlayer); break
          case 'B': setColumnBSolver(currentPlayer); break
          case 'C': setColumnCSolver(currentPlayer); break
          case 'D': setColumnDSolver(currentPlayer); break
        }

        // Reveal all fields in the column
        setColumnState(column, {
          field1Revealed: true,
          field2Revealed: true,
          field3Revealed: true,
          field4Revealed: true,
          solutionRevealed: true,
        })

        // Player can continue guessing other solutions, but cannot open more boxes
      } else {
        // Wrong guess - switch player
        switchPlayer()
      }
    }

    setGuessType('none')
    setGuessInput('')
  }

  const handleYield = () => {
    switchPlayer()
    setGuessType('none')
    setGuessInput('')
  }

  const switchPlayer = () => {
    setCurrentPlayer(prev => prev === 1 ? 2 : 1)
    setBoxOpenedThisTurn(false)
  }

  const revealAllFields = () => {
    setColumnAState({
      field1Revealed: true,
      field2Revealed: true,
      field3Revealed: true,
      field4Revealed: true,
      solutionRevealed: true,
    })
    setColumnBState({
      field1Revealed: true,
      field2Revealed: true,
      field3Revealed: true,
      field4Revealed: true,
      solutionRevealed: true,
    })
    setColumnCState({
      field1Revealed: true,
      field2Revealed: true,
      field3Revealed: true,
      field4Revealed: true,
      solutionRevealed: true,
    })
    setColumnDState({
      field1Revealed: true,
      field2Revealed: true,
      field3Revealed: true,
      field4Revealed: true,
      solutionRevealed: true,
    })
    setFinalSolutionRevealed(true)
  }

  const getColumnSolver = (column: ColumnName): 0 | 1 | 2 => {
    switch (column) {
      case 'A': return columnASolver
      case 'B': return columnBSolver
      case 'C': return columnCSolver
      case 'D': return columnDSolver
    }
  }

  const renderField = (column: ColumnName, field: 1 | 2 | 3 | 4) => {
    const state = getColumnState(column)
    const fieldKey = `field${field}Revealed` as keyof ColumnState
    const isRevealed = state[fieldKey]
    const columnData = getColumnData(column)
    const fieldValue = columnData[`field${field}` as keyof typeof columnData] as string
    const solver = getColumnSolver(column)
    const solverClass = solver === 1 ? 'player1-solved' : solver === 2 ? 'player2-solved' : ''

    return (
      <button
        className={`field ${isRevealed ? 'revealed' : ''} ${solverClass}`}
        onClick={() => handleFieldClick(column, field)}
        disabled={gameEnded || boxOpenedThisTurn}
      >
        {isRevealed ? fieldValue : `${column}${field}`}
      </button>
    )
  }

  const renderSolution = (column: ColumnName) => {
    const state = getColumnState(column)
    const columnData = getColumnData(column)
    const canGuess = hasAnyFieldRevealed(column) && !state.solutionRevealed && !gameEnded && boxOpenedThisTurn
    const solver = getColumnSolver(column)
    const solverClass = solver === 1 ? 'player1-solved' : solver === 2 ? 'player2-solved' : ''

    return (
      <button
        className={`solution ${state.solutionRevealed ? 'revealed' : ''} ${canGuess ? 'can-guess' : ''} ${solverClass}`}
        onClick={() => handleGuessColumn(column)}
        disabled={gameEnded || !canGuess}
      >
        {state.solutionRevealed ? columnData.solution : column}
      </button>
    )
  }

  return (
    <div className="asocijacije-play">
      <div className="game-header">
        <h3>Asocijacije</h3>
        <div className="timer">Time: {formatTime(timeElapsed)}</div>
        <div className="scores">
          <span className={currentPlayer === 1 ? 'active-player' : ''}>
            Player 1: {player1Score}
          </span>
          <span className={currentPlayer === 2 ? 'active-player' : ''}>
            Player 2: {player2Score}
          </span>
        </div>
      </div>

      <div className="game-board">
        {/* Top Left - Column A */}
        <div className="column column-a">
          {renderField('A', 1)}
          {renderField('A', 2)}
          {renderField('A', 3)}
          {renderField('A', 4)}
          {renderSolution('A')}
        </div>

        {/* Top Right - Column B */}
        <div className="column column-b">
          {renderField('B', 1)}
          {renderField('B', 2)}
          {renderField('B', 3)}
          {renderField('B', 4)}
          {renderSolution('B')}
        </div>

        {/* Center - Final Solution */}
        <button
          className={`final-solution ${finalSolutionRevealed ? 'revealed' : ''} ${!gameEnded && boxOpenedThisTurn ? 'can-guess' : ''}`}
          onClick={handleGuessFinal}
          disabled={gameEnded || !boxOpenedThisTurn}
        >
          {finalSolutionRevealed ? gameConfig.finalSolution : '?'}
        </button>

        {/* Bottom Left - Column C */}
        <div className="column column-c">
          {renderField('C', 1)}
          {renderField('C', 2)}
          {renderField('C', 3)}
          {renderField('C', 4)}
          {renderSolution('C')}
        </div>

        {/* Bottom Right - Column D */}
        <div className="column column-d">
          {renderField('D', 1)}
          {renderField('D', 2)}
          {renderField('D', 3)}
          {renderField('D', 4)}
          {renderSolution('D')}
        </div>
      </div>

      {guessType !== 'none' && !gameEnded && (
        <div className="guess-panel">
          <h4>
            {guessType === 'final' ? 'Guess Final Solution' : `Guess Column ${guessType.replace('column', '')} Solution`}
          </h4>
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder="Enter your guess"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmitGuess()
            }}
          />
          <div className="guess-buttons">
            <button onClick={handleSubmitGuess}>Submit</button>
            <button onClick={handleYield}>Yield</button>
          </div>
        </div>
      )}

      {!gameEnded && guessType === 'none' && (
        <div className="turn-actions">
          <p>Current Player: Player {currentPlayer}</p>
          {!boxOpenedThisTurn ? (
            <p className="instruction">Click any unopened box to reveal it</p>
          ) : (
            <p className="instruction">Now you can guess a column or final solution, or yield</p>
          )}
          <button onClick={handleYield} disabled={!boxOpenedThisTurn}>Yield Turn</button>
        </div>
      )}

      {gameEnded && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <div className="final-scores">
            <p>Player 1: {player1Score} points</p>
            <p>Player 2: {player2Score} points</p>
            <p className="winner">
              {player1Score > player2Score
                ? 'Player 1 Wins!'
                : player2Score > player1Score
                ? 'Player 2 Wins!'
                : "It's a Tie!"}
            </p>
          </div>
          <button onClick={onBack}>Back to Menu</button>
        </div>
      )}

      {!gameEnded && (
        <div className="back-button">
          <button onClick={onBack}>Exit Game</button>
        </div>
      )}
    </div>
  )
}
