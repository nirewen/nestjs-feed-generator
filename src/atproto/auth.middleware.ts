import {
    AuthRequiredError,
    parseReqNsid,
    verifyJwt,
} from '@atproto/xrpc-server'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { AppContext } from './util/config'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private ctx: AppContext) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (process.env.NODE_ENV === 'production') {
            const { authorization = '' } = req.headers
            if (!authorization.startsWith('Bearer ')) {
                throw new AuthRequiredError()
            }
            const jwt = authorization.replace('Bearer ', '').trim()
            const nsid = parseReqNsid(req)
            const parsed = await verifyJwt(
                jwt,
                this.ctx.cfg.serviceDid,
                nsid,
                async (did: string) => {
                    return this.ctx.didResolver.resolveAtprotoKey(did)
                },
            )

            req.headers['x-did'] = parsed.iss
        }

        next()
    }
}
