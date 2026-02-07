import { SlagalicaGameState } from '../features/slagalica/types'
import { AsocijacijeGameState } from '../features/asocijacije/types'
import { MojBrojGameState } from '../features/moj-broj/types'
import { SkockoGameState } from '../features/skocko/types'
import { SpojniceGameState } from '../features/spojnice/types'

export interface AllGamesConfig {
  version: string
  slagalica: SlagalicaGameState | null
  asocijacije: AsocijacijeGameState | null
  mojBroj: MojBrojGameState | null
  skocko: SkockoGameState | null
  spojnice: SpojniceGameState | null
}

export const saveConfigToFile = (config: AllGamesConfig): void => {
  const jsonString = JSON.stringify(config, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `slagalica-config-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const loadConfigFromFile = (): Promise<AllGamesConfig> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        reject(new Error('No file selected'))
        return
      }

      try {
        const text = await file.text()
        const config = JSON.parse(text) as AllGamesConfig

        // Validate the config structure
        if (!config.version || typeof config !== 'object') {
          throw new Error('Invalid configuration file format')
        }

        resolve(config)
      } catch (error) {
        reject(error)
      }
    }

    input.click()
  })
}
