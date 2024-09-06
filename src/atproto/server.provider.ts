import { Provider } from '@nestjs/common';
import { createServer, Server } from './lexicon';

export const ServerProvider = {
    provide: Server,
    useFactory() {
        return createServer({
            validateResponse: true,
            payload: {
                jsonLimit: 100 * 1024, // 100kb
                textLimit: 100 * 1024, // 100kb
                blobLimit: 5 * 1024 * 1024, // 5mb
            },
        });
    },
} satisfies Provider;
