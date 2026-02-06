export interface AsocijacijeColumn {
  field1: string
  field2: string
  field3: string
  field4: string
  solution: string
}

export interface AsocijacijeGameState {
  columnA: AsocijacijeColumn
  columnB: AsocijacijeColumn
  columnC: AsocijacijeColumn
  columnD: AsocijacijeColumn
  finalSolution: string
  isConfigured: boolean
}

export interface ColumnState {
  field1Revealed: boolean
  field2Revealed: boolean
  field3Revealed: boolean
  field4Revealed: boolean
  solutionRevealed: boolean
}

export interface AsocijacijePlayState {
  columnA: ColumnState
  columnB: ColumnState
  columnC: ColumnState
  columnD: ColumnState
  finalSolutionRevealed: boolean
  currentPlayer: 1 | 2
  player1Score: number
  player2Score: number
  timeElapsed: number
  gameEnded: boolean
}
