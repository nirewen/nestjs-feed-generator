import { NestFactory } from '@nestjs/core';
import { z } from 'zod';
import { AppModule } from './app.module';

const envSchema = z.object({
    FEEDGEN_HOSTNAME: z.string().default('example.com'),
    FEEDGEN_SERVICE_DID: z.string().default('did:web:example.com'),
    FEEDGEN_PORT: z.coerce.number().default(3000),
    FEEDGEN_LISTENHOST: z.string().default('localhost'),
    FEEDGEN_SQLITE_LOCATION: z.string().default(':memory:'),
    FEEDGEN_SUBSCRIPTION_ENDPOINT: z.string().default('wss://bsky.network'),
    FEEDGEN_PUBLISHER_DID: z.string().default('did:example:alice'),
    FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY: z.coerce.number().default(3000),
    BLUESKY_USERNAME: z.string(),
    BLUESKY_PASSWORD: z.string(),
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const env = envSchema.parse(process.env);

    await app.listen(env.FEEDGEN_PORT);
}
bootstrap();
