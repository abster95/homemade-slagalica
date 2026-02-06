import { useState, useEffect, useMemo } from 'react'
import { SlagalicaGameState } from './types'
import './SlagalicaPlay.css'

interface SlagalicaPlayProps {
  gameConfig: SlagalicaGameState
  onBack: () => void
}

export function SlagalicaPlay({ gameConfig, onBack }: SlagalicaPlayProps) {
  const [currentRound, setCurrentRound] = useState<1 | 2>(1)
  const [timeElapsed, setTimeElapsed] = useState(10)
  const [showPlayerInputs, setShowPlayerInputs] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)

  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [player1Word, setPlayer1Word] = useState('')
  const [player2Word, setPlayer2Word] = useState('')
  const [player1Saved, setPlayer1Saved] = useState(false)
  const [player2Saved, setPlayer2Saved] = useState(false)
  const [roundComplete, setRoundComplete] = useState(false)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [player1RoundPoints, setPlayer1RoundPoints] = useState(0)
  const [player2RoundPoints, setPlayer2RoundPoints] = useState(0)

  // Generate random alphanumeric character
  const getRandomChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPRSTUVZ'
    return chars[Math.floor(Math.random() * chars.length)]
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Pad word with random characters and scramble
  const padAndScrambleWord = (word: string): string[] => {
    const wordChars = word.split('')
    let allChars = wordChars
    if (wordChars.length < 13) {
      const padding = Array.from(
        { length: 13 - wordChars.length },
        () => getRandomChar()
      )
      allChars = [...wordChars, ...padding]
    }
    return shuffleArray(allChars)
  }

  // Pad word with random characters if needed, then scramble (memoized per word)
  const paddedWord1 = useMemo(() => padAndScrambleWord(gameConfig.word1), [gameConfig.word1])
  const paddedWord2 = useMemo(() => padAndScrambleWord(gameConfig.word2), [gameConfig.word2])

  const currentWord = currentRound === 1 ? gameConfig.word1 : gameConfig.word2
  const characters = currentRound === 1 ? paddedWord1 : paddedWord2

  // Timer effect
  useEffect(() => {
    if (roundComplete) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const next = prev - 1 < 0 ? 0 : prev - 1
        if (next === 0 && !showPlayerInputs) {
          setShowPlayerInputs(true)
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [roundComplete, showPlayerInputs])

  const handleCharacterClick = (index: number) => {
    if (selectedIndices.includes(index)) return
    if ((currentPlayer === 1 && player1Saved) || (currentPlayer === 2 && player2Saved)) return

    const newIndices = [...selectedIndices, index]
    const newWord = newIndices.map(i => characters[i]).join('')

    setSelectedIndices(newIndices)
    if (currentPlayer === 1) {
      setPlayer1Word(newWord)
    } else {
      setPlayer2Word(newWord)
    }
  }

  const handleDismiss = () => {
    setSelectedIndices([])
    if (currentPlayer === 1) {
      setPlayer1Word('')
    } else {
      setPlayer2Word('')
    }
  }

  const handleSaveWord = () => {
    if (currentPlayer === 1) {
      setPlayer1Saved(true)
      setCurrentPlayer(2)
      setSelectedIndices([])
    } else {
      setPlayer2Saved(true)
      setRoundComplete(true)

      // Calculate scores
      const p1Length = player1Word.length
      const p2Length = player2Word.length

      if (p1Length > p2Length) {
        // Player 1 has longer word - award 10 points
        let points = 10
        // Award additional 5 points if word matches game master's word
        if (player1Word === currentWord) {
          points += 5
        }
        setPlayer1Score(prev => prev + points)
        setPlayer1RoundPoints(points)
        setPlayer2RoundPoints(0)
      } else if (p2Length > p1Length) {
        // Player 2 has longer word - award 10 points
        let points = 10
        // Award additional 5 points if word matches game master's word
        if (player2Word === currentWord) {
          points += 5
        }
        setPlayer2Score(prev => prev + points)
        setPlayer1RoundPoints(0)
        setPlayer2RoundPoints(points)
      } else {
        // Same length - award points to player 1 in round 1, player 2 in round 2
        if (currentRound === 1) {
          let points = 10
          if (player1Word === currentWord) {
            points += 5
          }
          setPlayer1Score(prev => prev + points)
          setPlayer1RoundPoints(points)
          setPlayer2RoundPoints(0)
        } else {
          let points = 10
          if (player2Word === currentWord) {
            points += 5
          }
          setPlayer2Score(prev => prev + points)
          setPlayer1RoundPoints(0)
          setPlayer2RoundPoints(points)
        }
      }
    }
  }

  const handleNextRound = () => {
    if (currentRound === 1) {
      // Start round 2
      setCurrentRound(2)
      setTimeElapsed(10)
      setShowPlayerInputs(false)
      setCurrentPlayer(1)
      setSelectedIndices([])
      setPlayer1Word('')
      setPlayer2Word('')
      setPlayer1Saved(false)
      setPlayer2Saved(false)
      setRoundComplete(false)
      setPlayer1RoundPoints(0)
      setPlayer2RoundPoints(0)
    } else {
      // Game complete
      onBack()
    }
  }

  return (
    <div className="slagalica-play">
      <h3>Slagalica - Round {currentRound}</h3>
      <div className="timer">Time: {timeElapsed}s</div>

      <div className="character-boxes">
        {characters.map((char, index) => (
          <button
            key={index}
            className={`character-box ${selectedIndices.includes(index) ? 'selected' : ''}`}
            onClick={() => handleCharacterClick(index)}
            disabled={!showPlayerInputs || selectedIndices.includes(index)}
          >
            {char}
          </button>
        ))}
      </div>

      {showPlayerInputs && (
        <div className="player-inputs">
          <div className="player-section">
            <label>Player 1:</label>
            <input
              type="text"
              value={player1Word}
              readOnly
              className={player1Saved ? 'saved' : ''}
            />
            {player1Saved && roundComplete && player1RoundPoints > 0 && (
              <span className="points">+{player1RoundPoints}</span>
            )}
          </div>

          <div className="player-section">
            <label>Player 2:</label>
            <input
              type="text"
              value={player2Word}
              readOnly
              className={player2Saved ? 'saved' : ''}
            />
            {player2Saved && roundComplete && player2RoundPoints > 0 && (
              <span className="points">+{player2RoundPoints}</span>
            )}
          </div>

          {roundComplete && (
            <div className="player-section">
              <label>Game Master Word:</label>
              <input type="text" value={currentWord} readOnly className="master-word" />
            </div>
          )}

          {!roundComplete && (
            <div className="action-buttons">
              {currentPlayer === 1 && !player1Saved && (
                <>
                  <button onClick={handleDismiss}>Dismiss</button>
                  <button onClick={handleSaveWord} disabled={player1Word.length === 0}>
                    Save Word
                  </button>
                </>
              )}
              {currentPlayer === 2 && !player2Saved && (
                <>
                  <button onClick={handleDismiss}>Dismiss</button>
                  <button onClick={handleSaveWord} disabled={player2Word.length === 0}>
                    Save Word
                  </button>
                </>
              )}
            </div>
          )}
        </div>
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
