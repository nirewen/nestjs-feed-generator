import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NextFunction, Request, Response, Router } from 'express'
import { AppContext, Config } from './util/config'

const makeRouter: (ctx: AppContext) => Router = (ctx: AppContext) => {
    const router = Router()

    router.get('/.well-known/did.json', (_req, res) => {
        if (!ctx.cfg.serviceDid.endsWith(ctx.cfg.hostname)) {
            return res.sendStatus(404)
        }
        res.json({
            '@context': ['https://www.w3.org/ns/did/v1'],
            id: ctx.cfg.serviceDid,
            service: [
                {
                    id: '#bsky_fg',
                    type: 'BskyFeedGenerator',
                    serviceEndpoint: `https://${ctx.cfg.hostname}`,
                },
            ],
        })
    })

    return router
}

@Injectable()
export class WellKnownMiddleware implements NestMiddleware {
    constructor(private config: ConfigService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const cfg = {
            hostname: this.config.get('FEEDGEN_HOSTNAME'),
            sqliteLocation: this.config.get('FEEDGEN_SUBSCRIPTION_ENDPOINT'),
            subscriptionEndpoint: this.config.get(
                'FEEDGEN_SUBSCRIPTION_ENDPOINT',
            ),
            publisherDid: this.config.get('FEEDGEN_PUBLISHER_DID'),
            listenhost: this.config.get('FEEDGEN_LISTENHOST'),
            port: this.config.get('FEEDGEN_PORT'),
            serviceDid: this.config.get('FEEDGEN_SERVICE_DID'),
            subscriptionReconnectDelay: this.config.get(
                'FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY',
            ),
        } satisfies Config
        const router = makeRouter({
            db: null,
            didResolver: null,
            cfg,
        })

        router(req, res, next)
    }
}
