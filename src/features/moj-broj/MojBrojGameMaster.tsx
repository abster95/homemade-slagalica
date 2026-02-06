import { useState } from 'react'
import { MojBrojGameState } from './types'
import './MojBrojGameMaster.css'

interface MojBrojGameMasterProps {
  onSave: (gameState: MojBrojGameState) => void
  onBack: () => void
}

export function MojBrojGameMaster({ onSave, onBack }: MojBrojGameMasterProps) {
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
  const [errors, setErrors] = useState<{ number1?: string; number2?: string }>({})

  const validateNumber = (numStr: string): string | null => {
    if (!numStr.trim()) {
      return 'Number cannot be empty'
    }
    const num = parseInt(numStr, 10)
    if (isNaN(num)) {
      return 'Must be a valid number'
    }
    if (num < 100 || num > 999) {
      return 'Must be a 3-digit number (100-999)'
    }
    return null
  }

  const handleSave = () => {
    const number1Error = validateNumber(number1)
    const number2Error = validateNumber(number2)

    if (number1Error || number2Error) {
      setErrors({
        number1: number1Error || undefined,
        number2: number2Error || undefined,
      })
      return
    }

    setErrors({})
    onSave({
      number1: parseInt(number1, 10),
      number2: parseInt(number2, 10),
      isConfigured: true,
    })
  }

  return (
    <div className="moj-broj-game-master">
      <h3>Moj Broj - Game Master Setup</h3>
      <p>Enter two 3-digit numbers for the players to reach.</p>

      <div className="number-input-group">
        <label htmlFor="number1">Round 1 Number:</label>
        <input
          id="number1"
          type="number"
          value={number1}
          onChange={(e) => setNumber1(e.target.value)}
          placeholder="Enter 3-digit number (100-999)"
          min={100}
          max={999}
        />
        {errors.number1 && <span className="error">{errors.number1}</span>}
      </div>

      <div className="number-input-group">
        <label htmlFor="number2">Round 2 Number:</label>
        <input
          id="number2"
          type="number"
          value={number2}
          onChange={(e) => setNumber2(e.target.value)}
          placeholder="Enter 3-digit number (100-999)"
          min={100}
          max={999}
        />
        {errors.number2 && <span className="error">{errors.number2}</span>}
      </div>

      <div className="button-group">
        <button onClick={handleSave}>Save</button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
