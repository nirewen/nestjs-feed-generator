import { DidResolver, MemoryCache } from '@atproto/identity'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Database } from './db/database.provider'
import { AppContext } from './util/config'

export const AppContextProvider = {
    provide: AppContext,
    useFactory(db: Database, config: ConfigService) {
        const didCache = new MemoryCache()
        const didResolver = new DidResolver({
            plcUrl: 'https://plc.directory',
            didCache,
        })

        return {
            db,
            didResolver,
            cfg: {
                hostname: config.get('FEEDGEN_HOSTNAME'),
                sqliteLocation: config.get('FEEDGEN_SUBSCRIPTION_ENDPOINT'),
                subscriptionEndpoint: config.get(
                    'FEEDGEN_SUBSCRIPTION_ENDPOINT',
                ),
                publisherDid: config.get('FEEDGEN_PUBLISHER_DID'),
                listenhost: config.get('FEEDGEN_LISTENHOST'),
                port: config.get('FEEDGEN_PORT'),
                serviceDid: config.get('FEEDGEN_SERVICE_DID'),
                subscriptionReconnectDelay: config.get(
                    'FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY',
                ),
            },
        }
    },
    inject: [Database, ConfigService],
} satisfies Provider
