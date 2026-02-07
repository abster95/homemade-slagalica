import { useState, useEffect } from 'react'
import { SpojniceGameState, RoundState, MatchState } from './types'
import './SpojnicePlay.css'

interface SpojnicePlayProps {
  gameConfig: SpojniceGameState
  onBack: () => void
}

export function SpojnicePlay({ gameConfig, onBack }: SpojnicePlayProps) {
  const [currentRound, setCurrentRound] = useState<1 | 2>(1)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [round1State, setRound1State] = useState<RoundState | null>(null)
  const [round2State, setRound2State] = useState<RoundState | null>(null)
  const [roundComplete, setRoundComplete] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)

  // Get current round pairs
  const getCurrentPairs = () => {
    return currentRound === 1 ? gameConfig.round1Pairs : gameConfig.round2Pairs
  }

  // Fisher-Yates shuffle algorithm
  const shuffleValueIndices = (): number[] => {
    const indices = Array.from({ length: 10 }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    return indices
  }

  // Initialize a round
  const initializeRound = (roundNum: 1 | 2) => {
    const firstPlayer = roundNum === 1 ? 1 : 2

    const roundState: RoundState = {
      roundNumber: roundNum,
      currentPlayer: firstPlayer,
      firstPlayer: firstPlayer,
      shuffledValueIndices: shuffleValueIndices(),
      matches: Array.from({ length: 10 }, (_, i) => ({
        keyIndex: i,
        valueIndex: null,
        matchedBy: 0,
      })),
      currentKeyIndex: 0,
      roundComplete: false,
    }

    if (roundNum === 1) {
      setRound1State(roundState)
    } else {
      setRound2State(roundState)
    }

    setCurrentPlayer(firstPlayer)
  }

  // Get current round state
  const getCurrentRoundState = (): RoundState => {
    return currentRound === 1 ? round1State! : round2State!
  }

  // Update round state
  const updateRoundState = (newState: RoundState) => {
    if (currentRound === 1) {
      setRound1State(newState)
    } else {
      setRound2State(newState)
    }
  }

  // Move to next unmatched key (for first player, all keys are unmatched initially)
  const moveToNextKey = (stateToUse?: RoundState): boolean => {
    const roundState = stateToUse || getCurrentRoundState()
    const { matches, currentKeyIndex } = roundState

    // Find next unmatched key
    for (let i = currentKeyIndex + 1; i < 10; i++) {
      if (matches[i].matchedBy === 0) {
        updateRoundState({
          ...roundState,
          currentKeyIndex: i,
        })
        return true
      }
    }

    // No more unmatched keys
    return false
  }

  // Handle turn complete (when a player finishes going through their keys)
  const handleTurnComplete = (stateToUse?: RoundState) => {
    const roundState = stateToUse || getCurrentRoundState()
    const { matches, firstPlayer, currentPlayer: roundCurrentPlayer } = roundState

    // Check if this is the first player's turn
    const isFirstPlayerTurn = roundCurrentPlayer === firstPlayer

    if (isFirstPlayerTurn) {
      // First player finished all 10 keys
      // Check if all pairs are matched
      const allMatched = matches.every((m) => m.matchedBy !== 0)

      if (allMatched) {
        handleRoundComplete(roundState)
        return
      }

      // There are unmatched pairs, switch to second player
      const otherPlayer = currentPlayer === 1 ? 2 : 1

      // Find first unmatched key for the second player
      const firstUnmatchedIndex = matches.findIndex((m) => m.matchedBy === 0)

      updateRoundState({
        ...roundState,
        currentPlayer: otherPlayer,
        currentKeyIndex: firstUnmatchedIndex,
      })
      setCurrentPlayer(otherPlayer)
    } else {
      // Second player has finished their turn (all unmatched keys)
      // End the round regardless of remaining unmatched pairs
      handleRoundComplete(roundState)
    }
  }

  // Handle round complete
  const handleRoundComplete = (stateToUse?: RoundState) => {
    const roundState = stateToUse || getCurrentRoundState()

    // Sort values to show correct pairs
    const sortedIndices = Array.from({ length: 10 }, (_, i) => i)

    updateRoundState({
      ...roundState,
      shuffledValueIndices: sortedIndices,
      roundComplete: true,
    })

    setRoundComplete(true)
  }

  // Handle value click
  const handleValueClick = (shuffledIndex: number) => {
    if (roundComplete || gameEnded) return

    const roundState = getCurrentRoundState()
    const { shuffledValueIndices, matches, currentKeyIndex } = roundState

    // Get the actual value index from shuffled position
    const valueIndex = shuffledValueIndices[shuffledIndex]

    // Check if this value is already matched
    const alreadyMatched = matches.some((m) => m.valueIndex === valueIndex)
    if (alreadyMatched) return

    // Check if current key is already matched (shouldn't happen with new logic)
    if (matches[currentKeyIndex].matchedBy !== 0) {
      moveToNextKey(roundState)
      return
    }

    // Check if this is the correct match
    const isCorrect = valueIndex === currentKeyIndex

    if (isCorrect) {
      // Correct match!
      const updatedMatches = [...matches]
      updatedMatches[currentKeyIndex] = {
        keyIndex: currentKeyIndex,
        valueIndex: valueIndex,
        matchedBy: currentPlayer,
      }

      // Check if all pairs are now matched
      const allMatched = updatedMatches.every((m) => m.matchedBy !== 0)

      // Create the new state with updated matches
      const newRoundState = {
        ...roundState,
        matches: updatedMatches,
      }

      // Update state
      updateRoundState(newRoundState)

      // Award 2 points
      if (currentPlayer === 1) {
        setPlayer1Score((prev) => prev + 2)
      } else {
        setPlayer2Score((prev) => prev + 2)
      }

      // Handle next action based on game state
      if (allMatched) {
        // All pairs matched, end the round immediately
        handleRoundComplete(newRoundState)
      } else if (!moveToNextKey(newRoundState)) {
        // No more keys for this player, handle turn complete
        handleTurnComplete(newRoundState)
      }
    } else {
      // Incorrect match - move to next key (using current state, no changes made)
      if (!moveToNextKey(roundState)) {
        // No more keys to try
        handleTurnComplete(roundState)
      }
    }
  }

  // Handle next round
  const handleNextRound = () => {
    if (currentRound === 1) {
      // Move to round 2
      setCurrentRound(2)
      setRoundComplete(false)
      initializeRound(2)
    } else {
      // Game complete
      setGameEnded(true)
    }
  }

  // Render key box
  const renderKey = (keyIndex: number) => {
    const roundState = getCurrentRoundState()
    const { matches, currentKeyIndex } = roundState
    const match = matches[keyIndex]
    const pairs = getCurrentPairs()
    const pair = pairs[keyIndex]

    // Determine if this key is highlighted (current key being attempted)
    const isHighlighted = currentKeyIndex === keyIndex && !roundComplete

    // Determine color based on who matched it (takes precedence over highlighting)
    const colorClass =
      match.matchedBy === 1
        ? 'player1-matched'
        : match.matchedBy === 2
        ? 'player2-matched'
        : isHighlighted
        ? 'highlighted'
        : ''

    return (
      <div key={keyIndex} className={`key-box ${colorClass}`}>
        {pair.key}
      </div>
    )
  }

  // Render value box
  const renderValue = (shuffledIndex: number) => {
    const roundState = getCurrentRoundState()
    const { shuffledValueIndices, matches } = roundState

    // Get actual value index
    const valueIndex = shuffledValueIndices[shuffledIndex]
    const pairs = getCurrentPairs()
    const pair = pairs[valueIndex]

    // Find if this value is matched
    const matchedPair = matches.find((m) => m.valueIndex === valueIndex)

    // Determine color based on who matched it
    const colorClass =
      matchedPair && matchedPair.matchedBy === 1
        ? 'player1-matched'
        : matchedPair && matchedPair.matchedBy === 2
        ? 'player2-matched'
        : ''

    const isClickable = !roundComplete && !gameEnded && (!matchedPair || matchedPair.matchedBy === 0)

    return (
      <button
        key={shuffledIndex}
        className={`value-box ${colorClass} ${isClickable ? 'clickable' : ''}`}
        onClick={() => handleValueClick(shuffledIndex)}
        disabled={!isClickable}
      >
        {pair.value}
      </button>
    )
  }

  // Initialize Round 1 on component mount
  useEffect(() => {
    if (!round1State) {
      initializeRound(1)
    }
  }, [])

  // Don't render until round is initialized
  if (!round1State && currentRound === 1) {
    return <div>Loading...</div>
  }

  if (!round2State && currentRound === 2) {
    return <div>Loading...</div>
  }

  return (
    <div className="spojnice-play">
      <div className="game-header">
        <h3>Spojnice - Round {currentRound}</h3>
        <div className="scores">
          <span className={currentPlayer === 1 && !roundComplete && !gameEnded ? 'active-player' : ''}>
            Player 1: {player1Score}
          </span>
          <span className={currentPlayer === 2 && !roundComplete && !gameEnded ? 'active-player' : ''}>
            Player 2: {player2Score}
          </span>
        </div>
        {!roundComplete && !gameEnded && (
          <div className="current-player">Current Player: Player {currentPlayer}</div>
        )}
      </div>

      <div className="game-board">
        <div className="keys-column">
          <div className="column-header">Keys</div>
          {Array.from({ length: 10 }, (_, i) => renderKey(i))}
        </div>

        <div className="values-column">
          <div className="column-header">Values</div>
          {Array.from({ length: 10 }, (_, i) => renderValue(i))}
        </div>
      </div>

      {roundComplete && !gameEnded && (
        <div className="round-complete">
          <h4>Round {currentRound} Complete!</h4>
          <button onClick={handleNextRound}>
            {currentRound === 1 ? 'Start Round 2' : 'View Final Results'}
          </button>
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

      {!gameEnded && !roundComplete && (
        <div className="instructions">
          <p>Click a value to match it with the highlighted key</p>
        </div>
      )}
    </div>
  )
}
