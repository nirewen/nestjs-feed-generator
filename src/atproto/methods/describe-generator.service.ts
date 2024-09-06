import { AtUri } from '@atproto/syntax'
import algos from '../algos'
import { AppContext } from '../util/config'

import { Injectable } from '@nestjs/common'
import { Server } from '../lexicon'

@Injectable()
export class DescribeGeneratorService {
    constructor(server: Server, ctx: AppContext) {
        server.app.bsky.feed.describeFeedGenerator(async () => {
            const feeds = Object.keys(algos).map((shortname) => ({
                uri: AtUri.make(
                    ctx.cfg.publisherDid,
                    'app.bsky.feed.generator',
                    shortname,
                ).toString(),
            }))
            return {
                encoding: 'application/json',
                body: {
                    did: ctx.cfg.serviceDid,
                    feeds,
                },
            }
        })
    }
}
