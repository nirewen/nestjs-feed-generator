import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AtProtoMiddleware } from './atproto.middleware'
import { AuthMiddleware } from './auth.middleware'
import { AppContextProvider } from './context.provider'
import { DatabaseModule } from './db/database.module'
import { FirehoseSubscriptionService } from './firehose.provider'
import { DescribeGeneratorService } from './methods/describe-generator.service'
import { FeedGenerationService } from './methods/feed-generation.service'
import { ServerProvider } from './server.provider'
import { WellKnownMiddleware } from './well-known.middleware'

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [
        FirehoseSubscriptionService,
        DescribeGeneratorService,
        FeedGenerationService,
        ServerProvider,
        AppContextProvider,
    ],
})
export class AtProtoModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(WellKnownMiddleware).forRoutes('')
        consumer.apply(AuthMiddleware).forRoutes('')
        consumer.apply(AtProtoMiddleware).forRoutes('')
    }
}
