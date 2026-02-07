import { useState } from 'react'
import { SpojniceGameState, SpojnicePair } from './types'
import './SpojniceGameMaster.css'

interface SpojniceGameMasterProps {
  onSave: (gameState: SpojniceGameState) => void
  onBack: () => void
}

export function SpojniceGameMaster({ onSave, onBack }: SpojniceGameMasterProps) {
  const [round1Pairs, setRound1Pairs] = useState<SpojnicePair[]>(
    Array.from({ length: 10 }, () => ({ key: '', value: '' }))
  )
  const [round2Pairs, setRound2Pairs] = useState<SpojnicePair[]>(
    Array.from({ length: 10 }, () => ({ key: '', value: '' }))
  )
  const [errors, setErrors] = useState<string[]>([])

  const handleKeyChange = (round: 1 | 2, index: number, value: string) => {
    if (round === 1) {
      const newPairs = [...round1Pairs]
      newPairs[index] = { ...newPairs[index], key: value }
      setRound1Pairs(newPairs)
    } else {
      const newPairs = [...round2Pairs]
      newPairs[index] = { ...newPairs[index], key: value }
      setRound2Pairs(newPairs)
    }
  }

  const handleValueChange = (round: 1 | 2, index: number, value: string) => {
    if (round === 1) {
      const newPairs = [...round1Pairs]
      newPairs[index] = { ...newPairs[index], value: value }
      setRound1Pairs(newPairs)
    } else {
      const newPairs = [...round2Pairs]
      newPairs[index] = { ...newPairs[index], value: value }
      setRound2Pairs(newPairs)
    }
  }

  const handleSave = () => {
    const newErrors: string[] = []

    round1Pairs.forEach((pair, index) => {
      if (!pair.key.trim()) {
        newErrors.push(`Round 1, Pair ${index + 1} - Key is empty`)
      }
      if (!pair.value.trim()) {
        newErrors.push(`Round 1, Pair ${index + 1} - Value is empty`)
      }
    })

    round2Pairs.forEach((pair, index) => {
      if (!pair.key.trim()) {
        newErrors.push(`Round 2, Pair ${index + 1} - Key is empty`)
      }
      if (!pair.value.trim()) {
        newErrors.push(`Round 2, Pair ${index + 1} - Value is empty`)
      }
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    onSave({
      round1Pairs,
      round2Pairs,
      isConfigured: true,
    })
  }

  return (
    <div className="spojnice-game-master">
      <h3>Spojnice - Game Master Setup</h3>
      <p>Enter 20 pairs of terms (10 for each round). Keys will appear in the left column, values in the right column.</p>

      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((error, index) => (
            <div key={index} className="error">{error}</div>
          ))}
        </div>
      )}

      <div className="round-section">
        <h4>Round 1 Pairs</h4>
        <div className="pairs-grid">
          <div className="grid-header">
            <span>Keys (Left Column)</span>
            <span>Values (Right Column)</span>
          </div>
          {round1Pairs.map((pair, index) => (
            <div key={index} className="pair-row">
              <div className="pair-number">{index + 1}.</div>
              <input
                type="text"
                value={pair.key}
                onChange={(e) => handleKeyChange(1, index, e.target.value)}
                placeholder={`Key ${index + 1}`}
                className="key-input"
              />
              <input
                type="text"
                value={pair.value}
                onChange={(e) => handleValueChange(1, index, e.target.value)}
                placeholder={`Value ${index + 1}`}
                className="value-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="round-section">
        <h4>Round 2 Pairs</h4>
        <div className="pairs-grid">
          <div className="grid-header">
            <span>Keys (Left Column)</span>
            <span>Values (Right Column)</span>
          </div>
          {round2Pairs.map((pair, index) => (
            <div key={index} className="pair-row">
              <div className="pair-number">{index + 1}.</div>
              <input
                type="text"
                value={pair.key}
                onChange={(e) => handleKeyChange(2, index, e.target.value)}
                placeholder={`Key ${index + 1}`}
                className="key-input"
              />
              <input
                type="text"
                value={pair.value}
                onChange={(e) => handleValueChange(2, index, e.target.value)}
                placeholder={`Value ${index + 1}`}
                className="value-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleSave}>Save</button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
