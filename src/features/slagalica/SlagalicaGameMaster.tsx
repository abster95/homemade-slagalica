import { useState } from 'react'
import { SlagalicaGameState } from './types'
import './SlagalicaGameMaster.css'

interface SlagalicaGameMasterProps {
  onSave: (gameState: SlagalicaGameState) => void
  onBack: () => void
}

export function SlagalicaGameMaster({ onSave, onBack }: SlagalicaGameMasterProps) {
  const [word1, setWord1] = useState('')
  const [word2, setWord2] = useState('')
  const [errors, setErrors] = useState<{ word1?: string; word2?: string }>({})

  const validateWord = (word: string): string | null => {
    if (!word.trim()) {
      return 'Word cannot be empty'
    }
    if (word.includes(' ')) {
      return 'Word cannot contain whitespace'
    }
    if (!/^[a-zA-Z]+$/.test(word)) {
      return 'Word must contain only letters'
    }
    if (word.length > 13) {
      return 'Word must be at most 13 letters long'
    }
    return null
  }

  const handleSave = () => {
    const word1Error = validateWord(word1)
    const word2Error = validateWord(word2)

    if (word1Error || word2Error) {
      setErrors({
        word1: word1Error || undefined,
        word2: word2Error || undefined,
      })
      return
    }

    setErrors({})
    onSave({
      word1: word1.toUpperCase(),
      word2: word2.toUpperCase(),
      isConfigured: true,
    })
  }

  return (
    <div className="slagalica-game-master">
      <h3>Slagalica - Game Master Setup</h3>
      <p>Enter two words for the players to form words from.</p>

      <div className="word-input-group">
        <label htmlFor="word1">Round 1 Word:</label>
        <input
          id="word1"
          type="text"
          value={word1}
          onChange={(e) => setWord1(e.target.value)}
          placeholder="Enter word (max 13 letters)"
          maxLength={13}
        />
        {errors.word1 && <span className="error">{errors.word1}</span>}
      </div>

      <div className="word-input-group">
        <label htmlFor="word2">Round 2 Word:</label>
        <input
          id="word2"
          type="text"
          value={word2}
          onChange={(e) => setWord2(e.target.value)}
          placeholder="Enter word (max 13 letters)"
          maxLength={13}
        />
        {errors.word2 && <span className="error">{errors.word2}</span>}
      </div>

      <div className="button-group">
        <button onClick={handleSave}>Save</button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
