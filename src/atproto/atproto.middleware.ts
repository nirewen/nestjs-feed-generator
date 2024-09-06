import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { Server } from './lexicon'

@Injectable()
export class AtProtoMiddleware implements NestMiddleware {
    constructor(private server: Server) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.server.xrpc.router(req, res, next)
    }
}
