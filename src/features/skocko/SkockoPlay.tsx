import { useState } from 'react'
import { SkockoGameState, ShapeType, Sequence, Guess, PlayerGuesses } from './types'
import { ShapeIcon, SHAPE_TYPES } from './ShapeIcons'
import './SkockoPlay.css'

interface SkockoPlayProps {
  gameConfig: SkockoGameState
  onBack: () => void
}

export function SkockoPlay({ gameConfig, onBack }: SkockoPlayProps) {
  const [currentRound, setCurrentRound] = useState<1 | 2>(1)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [currentGuess, setCurrentGuess] = useState<ShapeType[]>([])

  const [player1Guesses, setPlayer1Guesses] = useState<PlayerGuesses>({
    guesses: [],
    hasGuessed: false,
    guessedCorrectly: false,
  })

  const [player2Guesses, setPlayer2Guesses] = useState<PlayerGuesses>({
    guesses: [],
    hasGuessed: false,
    guessedCorrectly: false,
  })

  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [roundComplete, setRoundComplete] = useState(false)
  const [solutionRevealed, setSolutionRevealed] = useState(false)

  const currentSolution = currentRound === 1 ? gameConfig.sequence1 : gameConfig.sequence2
  const firstPlayerThisRound = currentRound === 1 ? 1 : 2

  const calculateFeedback = (guess: Sequence, solution: Sequence): { red: number; yellow: number } => {
    let red = 0
    let yellow = 0

    // Track which positions in solution have been matched
    const solutionMatched = new Array(4).fill(false)
    const guessMatched = new Array(4).fill(false)

    // First pass: count exact matches (red)
    for (let i = 0; i < 4; i++) {
      if (guess[i] === solution[i]) {
        red++
        solutionMatched[i] = true
        guessMatched[i] = true
      }
    }

    // Second pass: count wrong position matches (yellow)
    for (let i = 0; i < 4; i++) {
      if (!guessMatched[i]) {
        for (let j = 0; j < 4; j++) {
          if (!solutionMatched[j] && guess[i] === solution[j]) {
            yellow++
            solutionMatched[j] = true
            break
          }
        }
      }
    }

    return { red, yellow }
  }

  const handleShapeClick = (shape: ShapeType) => {
    if (currentGuess.length < 4 && !roundComplete) {
      setCurrentGuess([...currentGuess, shape])
    }
  }

  const handleRemoveLast = () => {
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1))
    }
  }

  const handleClear = () => {
    setCurrentGuess([])
  }

  const handleLockIn = () => {
    if (currentGuess.length !== 4) return

    const guess = currentGuess as Sequence
    const feedback = calculateFeedback(guess, currentSolution)
    const newGuess: Guess = { sequence: guess, feedback }

    const isCorrect = feedback.red === 4

    if (currentPlayer === 1) {
      const updatedGuesses = {
        guesses: [...player1Guesses.guesses, newGuess],
        hasGuessed: true,
        guessedCorrectly: isCorrect,
      }
      setPlayer1Guesses(updatedGuesses)

      if (isCorrect) {
        // Player 1 guessed correctly
        const guessNumber = updatedGuesses.guesses.length
        let points = 0
        if (currentPlayer === firstPlayerThisRound && guessNumber <= 5) {
          points = 12 - 2 * guessNumber
        } else if (currentPlayer !== firstPlayerThisRound) {
          points = 5
        }
        setPlayer1Score((prev) => prev + points)
        setSolutionRevealed(true)
        setRoundComplete(true)
      } else if (updatedGuesses.guesses.length >= 5) {
        // Player 1 used all 5 guesses, switch to player 2 for 1 final guess
        if (!player2Guesses.hasGuessed) {
          setCurrentPlayer(2)
        } else {
          // Both players have finished, reveal solution
          setSolutionRevealed(true)
          setRoundComplete(true)
        }
      }
    } else {
      const updatedGuesses = {
        guesses: [...player2Guesses.guesses, newGuess],
        hasGuessed: true,
        guessedCorrectly: isCorrect,
      }
      setPlayer2Guesses(updatedGuesses)

      if (isCorrect) {
        // Player 2 guessed correctly
        const guessNumber = updatedGuesses.guesses.length
        let points = 0
        if (currentPlayer === firstPlayerThisRound && guessNumber <= 5) {
          points = 12 - 2 * guessNumber
        } else if (currentPlayer !== firstPlayerThisRound) {
          points = 5
        }
        setPlayer2Score((prev) => prev + points)
        setSolutionRevealed(true)
        setRoundComplete(true)
      } else if (updatedGuesses.guesses.length >= 5) {
        // Player 2 used all 5 guesses, switch to player 1 for 1 final guess
        if (!player1Guesses.hasGuessed) {
          setCurrentPlayer(1)
        } else {
          // Both players have finished, reveal solution
          setSolutionRevealed(true)
          setRoundComplete(true)
        }
      }
    }

    setCurrentGuess([])
  }

  const handleNextRound = () => {
    if (currentRound === 1) {
      // Start round 2
      setCurrentRound(2)
      setCurrentPlayer(2) // Player 2 goes first in round 2
      setCurrentGuess([])
      setPlayer1Guesses({ guesses: [], hasGuessed: false, guessedCorrectly: false })
      setPlayer2Guesses({ guesses: [], hasGuessed: false, guessedCorrectly: false })
      setRoundComplete(false)
      setSolutionRevealed(false)
    } else {
      // Game complete
      onBack()
    }
  }

  const canGuess = () => {
    if (roundComplete) return false
    if (currentPlayer === 1) {
      return player1Guesses.guesses.length < 5 || (!player1Guesses.hasGuessed && player2Guesses.guesses.length >= 5)
    } else {
      return player2Guesses.guesses.length < 5 || (!player2Guesses.hasGuessed && player1Guesses.guesses.length >= 5)
    }
  }

  return (
    <div className="skocko-play">
      <h3>Skočko - Round {currentRound}</h3>

      <div className="scores">
        <div className="player-score">Player 1: {player1Score} points</div>
        <div className="player-score">Player 2: {player2Score} points</div>
      </div>

      {!roundComplete && (
        <div className="current-player-indicator">
          <strong>Current Player: Player {currentPlayer}</strong>
          <span className="attempts-remaining">
            (Attempts: {currentPlayer === 1 ? player1Guesses.guesses.length : player2Guesses.guesses.length}/5)
          </span>
        </div>
      )}

      {solutionRevealed && (
        <div className="solution-reveal">
          <h4>Solution:</h4>
          <div className="sequence-display">
            {currentSolution.map((shape, idx) => (
              <div key={idx} className="sequence-slot filled">
                <ShapeIcon type={shape} size={50} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="guesses-section">
        <div className="player-guesses">
          <h4>Player 1 Guesses:</h4>
          {player1Guesses.guesses.length === 0 && <p className="no-guesses">No guesses yet</p>}
          {player1Guesses.guesses.map((guess, idx) => (
            <div key={idx} className="guess-row">
              <div className="guess-sequence">
                {guess.sequence.map((shape, shapeIdx) => (
                  <div key={shapeIdx} className="sequence-slot small">
                    <ShapeIcon type={shape} size={30} />
                  </div>
                ))}
              </div>
              <div className="feedback">
                {Array.from({ length: guess.feedback.red }).map((_, i) => (
                  <div key={`red-${i}`} className="feedback-circle red"></div>
                ))}
                {Array.from({ length: guess.feedback.yellow }).map((_, i) => (
                  <div key={`yellow-${i}`} className="feedback-circle yellow"></div>
                ))}
                {guess.feedback.red === 0 && guess.feedback.yellow === 0 && (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="feedback-circle empty"></div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="player-guesses">
          <h4>Player 2 Guesses:</h4>
          {player2Guesses.guesses.length === 0 && <p className="no-guesses">No guesses yet</p>}
          {player2Guesses.guesses.map((guess, idx) => (
            <div key={idx} className="guess-row">
              <div className="guess-sequence">
                {guess.sequence.map((shape, shapeIdx) => (
                  <div key={shapeIdx} className="sequence-slot small">
                    <ShapeIcon type={shape} size={30} />
                  </div>
                ))}
              </div>
              <div className="feedback">
                {Array.from({ length: guess.feedback.red }).map((_, i) => (
                  <div key={`red-${i}`} className="feedback-circle red"></div>
                ))}
                {Array.from({ length: guess.feedback.yellow }).map((_, i) => (
                  <div key={`yellow-${i}`} className="feedback-circle yellow"></div>
                ))}
                {guess.feedback.red === 0 && guess.feedback.yellow === 0 && (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="feedback-circle empty"></div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!roundComplete && canGuess() && (
        <div className="guess-input-section">
          <h4>Build Your Guess:</h4>
          <div className="current-guess">
            {currentGuess.map((shape, idx) => (
              <div key={idx} className="sequence-slot filled">
                <ShapeIcon type={shape} size={50} />
              </div>
            ))}
            {Array.from({ length: 4 - currentGuess.length }).map((_, idx) => (
              <div key={`empty-${idx}`} className="sequence-slot empty">
                ?
              </div>
            ))}
          </div>

          <div className="shape-buttons">
            {SHAPE_TYPES.map((shape) => (
              <button
                key={shape}
                className="shape-button"
                onClick={() => handleShapeClick(shape)}
                disabled={currentGuess.length >= 4}
              >
                <ShapeIcon type={shape} size={40} />
              </button>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={handleClear} disabled={currentGuess.length === 0}>
              Clear
            </button>
            <button onClick={handleRemoveLast} disabled={currentGuess.length === 0}>
              Remove Last
            </button>
            <button onClick={handleLockIn} disabled={currentGuess.length !== 4}>
              Lock In
            </button>
          </div>
        </div>
      )}

      {roundComplete && (
        <div className="round-complete">
          <button onClick={handleNextRound} className="next-button">
            {currentRound === 1 ? 'Start Round 2' : 'Finish Game'}
          </button>
        </div>
      )}

      {!roundComplete && !canGuess() && (
        <div className="waiting-message">
          <p>Waiting for other player to finish their turn...</p>
        </div>
      )}
    </div>
  )
}
