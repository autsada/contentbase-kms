export type Environment = 'production' | 'development'

export type EnvConfig = {
  ssl: boolean
  port: number
  hostname: string
}
