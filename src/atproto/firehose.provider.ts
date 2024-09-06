import {
    OutputSchema as RepoEvent,
    isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { AppContext } from './util/config'

import { Injectable } from '@nestjs/common'
import { FirehoseSubscription, getOpsByType } from './util/subscription'

@Injectable()
export class FirehoseSubscriptionService extends FirehoseSubscription {
    public firehose: FirehoseSubscription

    constructor(private ctx: AppContext) {
        super(ctx.cfg, ctx.db, ctx.cfg.subscriptionEndpoint)
        this.run(this.handleEvent.bind(this))
    }

    async handleEvent(evt: RepoEvent) {
        if (!isCommit(evt)) return
        const ops = await getOpsByType(evt)

        // This logs the text of every post off the firehose.
        // Just for fun :)
        // Delete before actually using
        // for (const post of ops.posts.creates) {
        //     console.log(post.record.text);
        // }

        const postsToDelete = ops.posts.deletes
            .filter((del) => {
                return del.author === this.ctx.cfg.publisherDid
            })
            .map((del) => del.uri)
        const postsToCreate = ops.posts.creates
            .filter((create) => {
                return create.author === this.ctx.cfg.publisherDid
            })
            .map((create) => {
                return {
                    uri: create.uri,
                    cid: create.cid,
                    text: create.record.text,
                    indexedAt: new Date().toISOString(),
                }
            })

        if (postsToDelete.length > 0) {
            await this.ctx.db
                .deleteFrom('post')
                .where('uri', 'in', postsToDelete)
                .execute()
        }
        if (postsToCreate.length > 0) {
            console.log(postsToCreate)
            await this.ctx.db
                .insertInto('post')
                .values(postsToCreate)
                .onConflict((oc) => oc.doNothing())
                .execute()
        }
    }
}
