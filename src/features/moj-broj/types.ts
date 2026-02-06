export interface MojBrojGameState {
  number1: number
  number2: number
  isConfigured: boolean
}

export interface PlayerExpression {
  expression: string
  result: number | null
  error?: string
}

export interface RoundState {
  roundNumber: 1 | 2
  timeElapsed: number
  currentPlayer: 1 | 2
  player1Expression: PlayerExpression | null
  player2Expression: PlayerExpression | null
  player1Locked: boolean
  player2Locked: boolean
  isComplete: boolean
}
