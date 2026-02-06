import { useState } from 'react'
import { AsocijacijeGameState, AsocijacijeColumn } from './types'
import './AsocijacijeGameMaster.css'

interface AsocijacijeGameMasterProps {
  onSave: (gameState: AsocijacijeGameState) => void
  onBack: () => void
}

export function AsocijacijeGameMaster({ onSave, onBack }: AsocijacijeGameMasterProps) {
  const [columnA, setColumnA] = useState<AsocijacijeColumn>({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    solution: '',
  })

  const [columnB, setColumnB] = useState<AsocijacijeColumn>({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    solution: '',
  })

  const [columnC, setColumnC] = useState<AsocijacijeColumn>({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    solution: '',
  })

  const [columnD, setColumnD] = useState<AsocijacijeColumn>({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    solution: '',
  })

  const [finalSolution, setFinalSolution] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const updateColumn = (
    column: 'A' | 'B' | 'C' | 'D',
    field: keyof AsocijacijeColumn,
    value: string
  ) => {
    const setter = column === 'A' ? setColumnA : column === 'B' ? setColumnB : column === 'C' ? setColumnC : setColumnD
    setter(prev => ({ ...prev, [field]: value }))
  }

  const validateAndSave = () => {
    const newErrors: string[] = []

    // Validate all fields are filled
    const checkColumn = (col: AsocijacijeColumn, name: string) => {
      if (!col.field1.trim()) newErrors.push(`Column ${name} Field 1 is empty`)
      if (!col.field2.trim()) newErrors.push(`Column ${name} Field 2 is empty`)
      if (!col.field3.trim()) newErrors.push(`Column ${name} Field 3 is empty`)
      if (!col.field4.trim()) newErrors.push(`Column ${name} Field 4 is empty`)
      if (!col.solution.trim()) newErrors.push(`Column ${name} Solution is empty`)
    }

    checkColumn(columnA, 'A')
    checkColumn(columnB, 'B')
    checkColumn(columnC, 'C')
    checkColumn(columnD, 'D')

    if (!finalSolution.trim()) {
      newErrors.push('Final Solution is empty')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    onSave({
      columnA,
      columnB,
      columnC,
      columnD,
      finalSolution,
      isConfigured: true,
    })
  }

  return (
    <div className="asocijacije-game-master">
      <h3>Asocijacije - Game Master Setup</h3>
      <p>Configure all fields and solutions for the association game.</p>

      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, i) => (
            <div key={i} className="error">{error}</div>
          ))}
        </div>
      )}

      <div className="columns-grid">
        <div className="column-section">
          <h4>Column A</h4>
          <input
            type="text"
            placeholder="A1"
            value={columnA.field1}
            onChange={(e) => updateColumn('A', 'field1', e.target.value)}
          />
          <input
            type="text"
            placeholder="A2"
            value={columnA.field2}
            onChange={(e) => updateColumn('A', 'field2', e.target.value)}
          />
          <input
            type="text"
            placeholder="A3"
            value={columnA.field3}
            onChange={(e) => updateColumn('A', 'field3', e.target.value)}
          />
          <input
            type="text"
            placeholder="A4"
            value={columnA.field4}
            onChange={(e) => updateColumn('A', 'field4', e.target.value)}
          />
          <input
            type="text"
            placeholder="Solution A"
            value={columnA.solution}
            onChange={(e) => updateColumn('A', 'solution', e.target.value)}
            className="solution-input"
          />
        </div>

        <div className="column-section">
          <h4>Column B</h4>
          <input
            type="text"
            placeholder="B1"
            value={columnB.field1}
            onChange={(e) => updateColumn('B', 'field1', e.target.value)}
          />
          <input
            type="text"
            placeholder="B2"
            value={columnB.field2}
            onChange={(e) => updateColumn('B', 'field2', e.target.value)}
          />
          <input
            type="text"
            placeholder="B3"
            value={columnB.field3}
            onChange={(e) => updateColumn('B', 'field3', e.target.value)}
          />
          <input
            type="text"
            placeholder="B4"
            value={columnB.field4}
            onChange={(e) => updateColumn('B', 'field4', e.target.value)}
          />
          <input
            type="text"
            placeholder="Solution B"
            value={columnB.solution}
            onChange={(e) => updateColumn('B', 'solution', e.target.value)}
            className="solution-input"
          />
        </div>

        <div className="column-section">
          <h4>Column C</h4>
          <input
            type="text"
            placeholder="C1"
            value={columnC.field1}
            onChange={(e) => updateColumn('C', 'field1', e.target.value)}
          />
          <input
            type="text"
            placeholder="C2"
            value={columnC.field2}
            onChange={(e) => updateColumn('C', 'field2', e.target.value)}
          />
          <input
            type="text"
            placeholder="C3"
            value={columnC.field3}
            onChange={(e) => updateColumn('C', 'field3', e.target.value)}
          />
          <input
            type="text"
            placeholder="C4"
            value={columnC.field4}
            onChange={(e) => updateColumn('C', 'field4', e.target.value)}
          />
          <input
            type="text"
            placeholder="Solution C"
            value={columnC.solution}
            onChange={(e) => updateColumn('C', 'solution', e.target.value)}
            className="solution-input"
          />
        </div>

        <div className="column-section">
          <h4>Column D</h4>
          <input
            type="text"
            placeholder="D1"
            value={columnD.field1}
            onChange={(e) => updateColumn('D', 'field1', e.target.value)}
          />
          <input
            type="text"
            placeholder="D2"
            value={columnD.field2}
            onChange={(e) => updateColumn('D', 'field2', e.target.value)}
          />
          <input
            type="text"
            placeholder="D3"
            value={columnD.field3}
            onChange={(e) => updateColumn('D', 'field3', e.target.value)}
          />
          <input
            type="text"
            placeholder="D4"
            value={columnD.field4}
            onChange={(e) => updateColumn('D', 'field4', e.target.value)}
          />
          <input
            type="text"
            placeholder="Solution D"
            value={columnD.solution}
            onChange={(e) => updateColumn('D', 'solution', e.target.value)}
            className="solution-input"
          />
        </div>
      </div>

      <div className="final-solution-section">
        <h4>Final Solution</h4>
        <input
          type="text"
          placeholder="Final Solution"
          value={finalSolution}
          onChange={(e) => setFinalSolution(e.target.value)}
          className="final-solution-input"
        />
      </div>

      <div className="button-group">
        <button onClick={validateAndSave}>Save</button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
