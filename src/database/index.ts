import { ConnectionOptions } from 'typeorm'

import Message from '../entities/message.entity'

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, NODE_ENV } =
  process.env

const config: ConnectionOptions = {
  name: NODE_ENV,
  dropSchema: NODE_ENV === 'test',
  type: 'postgres',
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [Message],
  synchronize: true
}

export default config
