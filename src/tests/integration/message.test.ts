import 'dotenv/config'
import 'reflect-metadata'
import { Connection, getConnection } from 'typeorm'
import supertest from 'supertest'

import App from '../../app'
import Routes from '../../routes'
import config from '../../database'
import { serviceResponse } from '../mocks'

const { NODE_ENV, TTL_MS, LIMIT_MSG } = process.env

jest.mock('axios', () => ({
  create: () => ({
    get: () => serviceResponse()
  })
}))

describe('Test message service', () => {
  let app: App

  beforeAll(async () => {
    app = new App([new Routes()])
    await app.connectToDatabase(config)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    const connection: Connection = getConnection(NODE_ENV)
    const entities = connection.entityMetadatas

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name)

      await repository.query(`DELETE FROM ${entity.tableName}`)
    })
  })

  it('should return message', async () => {
    const response = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      userId: '1',
      text: serviceResponse().data.message
    })
  })

  it('should return 5 messages', async () => {
    const response1 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response2 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response3 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response4 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response5 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')

    expect(response1.status).toEqual(200)
    expect(response2.status).toEqual(200)
    expect(response3.status).toEqual(200)
    expect(response4.status).toEqual(200)
    expect(response5.status).toEqual(200)
  })

  it('should return 6 messages with different users', async () => {
    const response1 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response2 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '2')
    const response3 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '3')
    const response4 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '4')
    const response5 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '5')
    const response6 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '6')

    expect(response1.status).toEqual(200)
    expect(response2.status).toEqual(200)
    expect(response3.status).toEqual(200)
    expect(response4.status).toEqual(200)
    expect(response5.status).toEqual(200)
    expect(response6.status).toEqual(200)
  })

  it('should return exceeds message limit error', async () => {
    const response1 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response2 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response3 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response4 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response5 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')
    const response6 = await supertest(app.getServer()).get('/api/v1/message').set('userid', '1')

    expect(response1.status).toEqual(200)
    expect(response2.status).toEqual(200)
    expect(response3.status).toEqual(200)
    expect(response4.status).toEqual(200)
    expect(response5.status).toEqual(200)
    expect(response6.status).toEqual(400)
    expect(response6.body).toMatchObject({
      message: 'Exceeds message limit'
    })
  })

  afterAll(async () => {
    jest.clearAllMocks()
    await getConnection(NODE_ENV).close()
  })
})
