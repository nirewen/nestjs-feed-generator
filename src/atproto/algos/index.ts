import {
    OutputSchema as AlgoOutput,
    QueryParams,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../util/config'
import * as whatsAlf from './whats-alf'

type AlgoHandler = (
    ctx: AppContext,
    params: QueryParams,
    requesterDid: string,
) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
    [whatsAlf.shortname]: whatsAlf.handler,
}

export default algos
