import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { Env } from '../types'

export interface Context {
  env: Env
  request: Request
}

export const createContext = ({
  req,
  env,
}: FetchCreateContextFnOptions & { env: Env }): Context => {
  return {
    env,
    request: req,
  }
}