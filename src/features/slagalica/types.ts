export interface SlagalicaGameState {
  word1: string
  word2: string
  isConfigured: boolean
}

export interface PlayerAnswer {
  word: string
  characterIndices: number[]
}

export interface RoundState {
  roundNumber: 1 | 2
  timeElapsed: number
  currentPlayer: 1 | 2 | null
  player1Answer: PlayerAnswer | null
  player2Answer: PlayerAnswer | null
  isComplete: boolean
}

export interface SlagalicaPlayState {
  gameConfig: SlagalicaGameState
  round1: RoundState
  round2: RoundState | null
  currentRound: 1 | 2
}
