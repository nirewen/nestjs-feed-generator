import { Kysely, Migrator, SqliteDialect } from 'kysely'

import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import SqliteDb from 'better-sqlite3'
import { migrationProvider } from './migrations'
import { DatabaseSchema } from './schema'

export const createDb = (location: string): Database => {
    return new Kysely<DatabaseSchema>({
        dialect: new SqliteDialect({
            database: new SqliteDb(location),
        }),
    })
}

export const migrateToLatest = async (db: Database) => {
    const migrator = new Migrator({ db, provider: migrationProvider })
    const { error } = await migrator.migrateToLatest()
    if (error) throw error
}

export class Database extends Kysely<DatabaseSchema> {}

export const DatabaseProvider = {
    provide: Database,
    async useFactory(config: ConfigService) {
        const db = createDb(config.get('FEEDGEN_SQLITE_LOCATION'))
        await migrateToLatest(db)

        return db
    },
    inject: [ConfigService],
} satisfies Provider
