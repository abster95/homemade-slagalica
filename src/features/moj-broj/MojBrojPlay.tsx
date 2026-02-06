import { useState, useEffect, useMemo } from 'react'
import { MojBrojGameState } from './types'
import './MojBrojPlay.css'

interface MojBrojPlayProps {
  gameConfig: MojBrojGameState
  onBack: () => void
}

export function MojBrojPlay({ gameConfig, onBack }: MojBrojPlayProps) {
  const [currentRound, setCurrentRound] = useState<1 | 2>(1)
  const [timeElapsed, setTimeElapsed] = useState(10)
  const [showPlayerInputs, setShowPlayerInputs] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)

  const [player1Expression, setPlayer1Expression] = useState('')
  const [player2Expression, setPlayer2Expression] = useState('')
  const [player1Locked, setPlayer1Locked] = useState(false)
  const [player2Locked, setPlayer2Locked] = useState(false)
  const [roundComplete, setRoundComplete] = useState(false)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [player1RoundPoints, setPlayer1RoundPoints] = useState(0)
  const [player2RoundPoints, setPlayer2RoundPoints] = useState(0)
  const [player1Result, setPlayer1Result] = useState<number | null>(null)
  const [player2Result, setPlayer2Result] = useState<number | null>(null)
  const [player1Error, setPlayer1Error] = useState<string | null>(null)
  const [player2Error, setPlayer2Error] = useState<string | null>(null)
  const [player1UsedIndices, setPlayer1UsedIndices] = useState<number[]>([])
  const [player2UsedIndices, setPlayer2UsedIndices] = useState<number[]>([])

  // Generate random numbers for each round
  const generateNumbers = (): number[] => {
    const singleDigits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1)
    const mediumNumbers = [10, 15, 20, 25]
    const largeNumbers = [20, 50, 75, 100]
    const medium = mediumNumbers[Math.floor(Math.random() * mediumNumbers.length)]
    const large = largeNumbers[Math.floor(Math.random() * largeNumbers.length)]
    return [...singleDigits, medium, large]
  }

  // Generate numbers once per round
  const numbersRound1 = useMemo(() => generateNumbers(), [])
  const numbersRound2 = useMemo(() => generateNumbers(), [])

  const currentTargetNumber = currentRound === 1 ? gameConfig.number1 : gameConfig.number2
  const currentNumbers = currentRound === 1 ? numbersRound1 : numbersRound2

  // Timer effect
  useEffect(() => {
    if (roundComplete) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const next = prev - 1 < 0 ? 0 : prev - 1
        if (next === 0 && !showPlayerInputs) {
          setShowPlayerInputs(true)
          // Set starting player based on round (Player 1 starts in round 1, Player 2 in round 2)
          setCurrentPlayer(currentRound === 1 ? 1 : 2)
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [roundComplete, showPlayerInputs, currentRound])

  const operations = ['+', '-', '*', '/', '(', ')']

  const handleNumberClick = (num: number, index: number) => {
    if ((currentPlayer === 1 && player1Locked) || (currentPlayer === 2 && player2Locked)) return

    const usedIndices = currentPlayer === 1 ? player1UsedIndices : player2UsedIndices
    if (usedIndices.includes(index)) return

    if (currentPlayer === 1) {
      setPlayer1Expression((prev) => prev + num.toString())
      setPlayer1UsedIndices((prev) => [...prev, index])
    } else {
      setPlayer2Expression((prev) => prev + num.toString())
      setPlayer2UsedIndices((prev) => [...prev, index])
    }
  }

  const handleOperationClick = (op: string) => {
    if ((currentPlayer === 1 && player1Locked) || (currentPlayer === 2 && player2Locked)) return

    if (currentPlayer === 1) {
      setPlayer1Expression((prev) => prev + op)
    } else {
      setPlayer2Expression((prev) => prev + op)
    }
  }

  const handleClear = () => {
    if (currentPlayer === 1) {
      setPlayer1Expression('')
      setPlayer1UsedIndices([])
    } else {
      setPlayer2Expression('')
      setPlayer2UsedIndices([])
    }
  }

  const evaluateExpression = (expr: string): { result: number | null; error: string | null } => {
    if (!expr.trim()) {
      return { result: null, error: 'Expression is empty' }
    }

    try {
      // Basic validation - check for valid characters
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        return { result: null, error: 'Invalid characters in expression' }
      }

      // Evaluate using Function constructor (safer than eval)
      const result = new Function(`'use strict'; return (${expr})`)()

      if (typeof result !== 'number' || !isFinite(result)) {
        return { result: null, error: 'Invalid result' }
      }

      return { result: Math.round(result), error: null }
    } catch (e) {
      return { result: null, error: 'Invalid expression' }
    }
  }

  const handleLockIn = () => {
    if (currentPlayer === 1) {
      const evaluation = evaluateExpression(player1Expression)
      setPlayer1Result(evaluation.result)
      setPlayer1Error(evaluation.error)
      setPlayer1Locked(true)

      // Check if player 2 has already locked in
      if (player2Locked) {
        // Both players have locked in, calculate scores
        calculateScores()
        setRoundComplete(true)
      } else {
        // Switch to player 2
        setCurrentPlayer(2)
      }
    } else {
      const evaluation = evaluateExpression(player2Expression)
      setPlayer2Result(evaluation.result)
      setPlayer2Error(evaluation.error)
      setPlayer2Locked(true)

      // Check if player 1 has already locked in
      if (player1Locked) {
        // Both players have locked in, calculate scores
        calculateScores()
        setRoundComplete(true)
      } else {
        // Switch to player 1
        setCurrentPlayer(1)
      }
    }
  }

  const calculateScores = () => {
    const p1Eval = evaluateExpression(player1Expression)
    const p2Eval = evaluateExpression(player2Expression)

    const p1Result = p1Eval.result !== null ? p1Eval.result : 999999
    const p2Result = p2Eval.result !== null ? p2Eval.result : 999999

    const p1Distance = Math.abs(currentTargetNumber - p1Result)
    const p2Distance = Math.abs(currentTargetNumber - p2Result)

    let p1Points = 0
    let p2Points = 0

    if (p1Distance < p2Distance) {
      // Player 1 is closer
      p1Points = Math.max(0, 10 - p1Distance)
    } else if (p2Distance < p1Distance) {
      // Player 2 is closer
      p2Points = Math.max(0, 10 - p2Distance)
    } else {
      // Same distance - award to player who went first in this round
      const firstPlayer = currentRound === 1 ? 1 : 2
      if (firstPlayer === 1) {
        p1Points = Math.max(0, 10 - p1Distance)
      } else {
        p2Points = Math.max(0, 10 - p2Distance)
      }
    }

    setPlayer1RoundPoints(p1Points)
    setPlayer2RoundPoints(p2Points)
    setPlayer1Score((prev) => prev + p1Points)
    setPlayer2Score((prev) => prev + p2Points)
  }

  const handleNextRound = () => {
    if (currentRound === 1) {
      // Start round 2
      setCurrentRound(2)
      setTimeElapsed(10)
      setShowPlayerInputs(false)
      setCurrentPlayer(2) // Player 2 goes first in round 2
      setPlayer1Expression('')
      setPlayer2Expression('')
      setPlayer1Locked(false)
      setPlayer2Locked(false)
      setRoundComplete(false)
      setPlayer1RoundPoints(0)
      setPlayer2RoundPoints(0)
      setPlayer1Result(null)
      setPlayer2Result(null)
      setPlayer1Error(null)
      setPlayer2Error(null)
      setPlayer1UsedIndices([])
      setPlayer2UsedIndices([])
    } else {
      // Game complete
      onBack()
    }
  }

  return (
    <div className="moj-broj-play">
      <h3>Moj Broj - Round {currentRound}</h3>
      <div className="timer">Time: {timeElapsed}s</div>

      {showPlayerInputs && !roundComplete && (
        <div className="current-player-indicator">
          <strong>Current Player: Player {currentPlayer}</strong>
        </div>
      )}

      <div className="target-number">
        <h2>Target Number: {currentTargetNumber}</h2>
      </div>

      <div className="number-boxes">
        {currentNumbers.map((num, index) => {
          const usedIndices = currentPlayer === 1 ? player1UsedIndices : player2UsedIndices
          const isUsed = usedIndices.includes(index)
          return (
            <button
              key={index}
              className={`number-box ${isUsed ? 'used' : ''}`}
              onClick={() => handleNumberClick(num, index)}
              disabled={!showPlayerInputs || isUsed}
            >
              {num}
            </button>
          )
        })}
      </div>

      {showPlayerInputs && (
        <>
          <div className="operation-boxes">
            {operations.map((op, index) => (
              <button
                key={index}
                className="operation-box"
                onClick={() => handleOperationClick(op)}
              >
                {op}
              </button>
            ))}
          </div>

          <div className="player-inputs">
            <div className={`player-section ${currentPlayer === 1 && !player1Locked && !roundComplete ? 'active' : ''}`}>
              <label>Player 1:</label>
              <input
                type="text"
                value={player1Expression}
                readOnly
                className={player1Locked ? 'locked' : ''}
              />
              {player1Locked && player1Result !== null && (
                <span className="result">= {player1Result}</span>
              )}
              {player1Locked && player1Error && (
                <span className="error-result">Error: {player1Error}</span>
              )}
              {player1Locked && roundComplete && player1RoundPoints > 0 && (
                <span className="points">+{player1RoundPoints}</span>
              )}
            </div>

            <div className={`player-section ${currentPlayer === 2 && !player2Locked && !roundComplete ? 'active' : ''}`}>
              <label>Player 2:</label>
              <input
                type="text"
                value={player2Expression}
                readOnly
                className={player2Locked ? 'locked' : ''}
              />
              {player2Locked && player2Result !== null && (
                <span className="result">= {player2Result}</span>
              )}
              {player2Locked && player2Error && (
                <span className="error-result">Error: {player2Error}</span>
              )}
              {player2Locked && roundComplete && player2RoundPoints > 0 && (
                <span className="points">+{player2RoundPoints}</span>
              )}
            </div>

            {!roundComplete && (
              <div className="action-buttons">
                {currentPlayer === 1 && !player1Locked && (
                  <>
                    <button onClick={handleClear}>Clear</button>
                    <button onClick={handleLockIn} disabled={player1Expression.length === 0}>
                      Lock In
                    </button>
                  </>
                )}
                {currentPlayer === 2 && !player2Locked && (
                  <>
                    <button onClick={handleClear}>Clear</button>
                    <button onClick={handleLockIn} disabled={player2Expression.length === 0}>
                      Lock In
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {roundComplete && (
        <div className="round-complete">
          <div className="scores">
            <p>Player 1: {player1Score} points</p>
            <p>Player 2: {player2Score} points</p>
          </div>
          <button onClick={handleNextRound}>
            {currentRound === 1 ? 'Round 2' : 'Finish Game'}
          </button>
        </div>
      )}

      {!showPlayerInputs && (
        <button onClick={onBack}>Back to Menu</button>
      )}
    </div>
  )
}
