import { AtUri } from '@atproto/syntax'
import { InvalidRequestError } from '@atproto/xrpc-server'
import algos from '../algos'
import { AppContext } from '../util/config'

import { Injectable } from '@nestjs/common'
import { Server } from '../lexicon'

@Injectable()
export class FeedGenerationService {
    constructor(server: Server, ctx: AppContext) {
        server.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
            const feedUri = new AtUri(params.feed)
            const algo = algos[feedUri.rkey]
            if (
                feedUri.hostname !== ctx.cfg.publisherDid ||
                feedUri.collection !== 'app.bsky.feed.generator' ||
                !algo
            ) {
                throw new InvalidRequestError(
                    'Unsupported algorithm',
                    'UnsupportedAlgorithm',
                )
            }
            /**
             * Get the DID of the requester, for user-specific results:
             * Auth is handled by auth.middleware.ts
             * If your feed doesn't need Authentication, remove from atproto.module.ts
             */
            const requesterDid = req.headers['x-did'] as string

            const body = await algo(ctx, params, requesterDid)

            return {
                encoding: 'application/json',
                body: body,
            }
        })
    }
}
