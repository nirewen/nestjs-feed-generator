import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtProtoModule } from './atproto/atproto.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AtProtoModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
