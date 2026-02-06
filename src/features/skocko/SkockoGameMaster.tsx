import { useState } from 'react'
import { SkockoGameState, ShapeType, Sequence } from './types'
import { ShapeIcon, SHAPE_TYPES } from './ShapeIcons'
import './SkockoGameMaster.css'

interface SkockoGameMasterProps {
  onSave: (gameState: SkockoGameState) => void
  onBack: () => void
}

export function SkockoGameMaster({ onSave, onBack }: SkockoGameMasterProps) {
  const [sequence1, setSequence1] = useState<ShapeType[]>([])
  const [sequence2, setSequence2] = useState<ShapeType[]>([])
  const [currentRound, setCurrentRound] = useState<1 | 2>(1)
  const [error, setError] = useState<string>('')

  const currentSequence = currentRound === 1 ? sequence1 : sequence2
  const setCurrentSequence = currentRound === 1 ? setSequence1 : setSequence2

  const handleShapeClick = (shape: ShapeType) => {
    if (currentSequence.length < 4) {
      setCurrentSequence([...currentSequence, shape])
      setError('')
    }
  }

  const handleRemoveLast = () => {
    if (currentSequence.length > 0) {
      setCurrentSequence(currentSequence.slice(0, -1))
    }
  }

  const handleClear = () => {
    setCurrentSequence([])
  }

  const handleNext = () => {
    if (currentSequence.length !== 4) {
      setError('Please select exactly 4 shapes')
      return
    }

    if (currentRound === 1) {
      setCurrentRound(2)
      setError('')
    }
  }

  const handleSave = () => {
    if (sequence1.length !== 4 || sequence2.length !== 4) {
      setError('Please configure both rounds')
      return
    }

    onSave({
      sequence1: sequence1 as Sequence,
      sequence2: sequence2 as Sequence,
      isConfigured: true,
    })
  }

  return (
    <div className="skocko-game-master">
      <h3>Skočko - Game Master Setup</h3>
      <p>Select a sequence of 4 shapes for each round.</p>

      <div className="round-indicator">
        <span className={currentRound === 1 ? 'active' : sequence1.length === 4 ? 'complete' : ''}>
          Round 1 {sequence1.length === 4 && '✓'}
        </span>
        <span className={currentRound === 2 ? 'active' : sequence2.length === 4 ? 'complete' : ''}>
          Round 2 {sequence2.length === 4 && '✓'}
        </span>
      </div>

      <div className="current-sequence">
        <h4>Current Sequence ({currentSequence.length}/4):</h4>
        <div className="sequence-display">
          {currentSequence.map((shape, idx) => (
            <div key={idx} className="sequence-slot filled">
              <ShapeIcon type={shape} size={50} />
            </div>
          ))}
          {Array.from({ length: 4 - currentSequence.length }).map((_, idx) => (
            <div key={`empty-${idx}`} className="sequence-slot empty">
              ?
            </div>
          ))}
        </div>
      </div>

      <div className="shape-selector">
        <h4>Select Shapes:</h4>
        <div className="shape-buttons">
          {SHAPE_TYPES.map((shape) => (
            <button
              key={shape}
              className="shape-button"
              onClick={() => handleShapeClick(shape)}
              disabled={currentSequence.length >= 4}
            >
              <ShapeIcon type={shape} size={60} />
              <span className="shape-label">{shape}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button onClick={handleClear} disabled={currentSequence.length === 0}>
          Clear
        </button>
        <button onClick={handleRemoveLast} disabled={currentSequence.length === 0}>
          Remove Last
        </button>
        {currentRound === 1 ? (
          <button onClick={handleNext} disabled={sequence1.length !== 4}>
            Next Round →
          </button>
        ) : (
          <button onClick={handleSave} disabled={sequence2.length !== 4}>
            Save
          </button>
        )}
        <button onClick={onBack}>Back</button>
      </div>

      {currentRound === 2 && sequence1.length === 4 && (
        <div className="previous-round-preview">
          <h4>Round 1 Sequence:</h4>
          <div className="sequence-display small">
            {sequence1.map((shape, idx) => (
              <div key={idx} className="sequence-slot filled">
                <ShapeIcon type={shape} size={30} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
