export type ShapeType = 'hearts' | 'spades' | 'clubs' | 'diamonds' | 'skocko' | 'fata'

export type Sequence = [ShapeType, ShapeType, ShapeType, ShapeType]

export interface SkockoGameState {
  sequence1: Sequence
  sequence2: Sequence
  isConfigured: boolean
}

export interface Guess {
  sequence: Sequence
  feedback: {
    red: number  // Correct shape in correct position
    yellow: number  // Correct shape in wrong position
  }
}

export interface PlayerGuesses {
  guesses: Guess[]
  hasGuessed: boolean
  guessedCorrectly: boolean
}
