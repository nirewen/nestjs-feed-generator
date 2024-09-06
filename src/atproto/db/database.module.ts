import { Module } from '@nestjs/common'
import { Database, DatabaseProvider } from './database.provider'

@Module({
    controllers: [],
    providers: [DatabaseProvider],
    exports: [Database],
})
export class DatabaseModule {}
