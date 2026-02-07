// Key-value pair structure
export interface SpojnicePair {
  key: string
  value: string
}

// Game configuration saved by Game Master
export interface SpojniceGameState {
  round1Pairs: SpojnicePair[]  // Array of 10 pairs for round 1
  round2Pairs: SpojnicePair[]  // Array of 10 pairs for round 2
  isConfigured: boolean
}

// Match tracking during gameplay
export interface MatchState {
  keyIndex: number           // Original index (0-9)
  valueIndex: number | null  // Matched value index
  matchedBy: 0 | 1 | 2      // 0=unmatched, 1=Player 1, 2=Player 2
}

// Round state
export interface RoundState {
  roundNumber: 1 | 2
  currentPlayer: 1 | 2
  firstPlayer: 1 | 2
  shuffledValueIndices: number[]  // Maps display position to original pair index
  matches: MatchState[]           // Array of 10 match states
  currentKeyIndex: number         // Currently highlighted key (0-9)
  roundComplete: boolean
}
