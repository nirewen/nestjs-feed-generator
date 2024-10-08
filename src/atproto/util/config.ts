import { DidResolver } from '@atproto/identity'
import { Database } from '../db/database.provider'

export class AppContext {
    db: Database
    didResolver: DidResolver
    cfg: Config
}

export type Config = {
    port: number
    listenhost: string
    hostname: string
    sqliteLocation: string
    subscriptionEndpoint: string
    serviceDid: string
    publisherDid: string
    subscriptionReconnectDelay: number
}
