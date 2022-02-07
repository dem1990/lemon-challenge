import 'dotenv/config'
import 'reflect-metadata'
import { Connection, getConnection, Repository } from 'typeorm'
import supertest from 'supertest'

import App from '../../app'
import Routes from '../../routes'
import config from '../../database'
import Quote from '../../entities/quote.entity'
import { generateTrade, getTrade, generateQuote } from '../mocks'

const { NODE_ENV, EXPIRES_QUOTE_MS } = process.env

jest.mock('axios', () => ({
  create: () => ({
    post: () => generateTrade(),
    get: () => getTrade()
  })
}))

describe('Test swap service', () => {
  let app: App
  let quoteRepository: Repository<Quote>

  beforeAll(async () => {
    app = new App([new Routes()])
    await app.connectToDatabase(config)
    quoteRepository = getConnection(NODE_ENV).getRepository(Quote)
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

  it('should return success swap. SELL', async () => {
    const ts = new Date().getTime()
    const expires = ts + Number(EXPIRES_QUOTE_MS!)
    const quote = quoteRepository.create(generateQuote({ ts, expires }))

    await quoteRepository.save(quote)

    const response = await supertest(app.getServer()).post(
      `/api/v1/quotes/${quote.id}/swap?action=SELL`
    )

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      action: 'SELL',
      quote: quote.id
    })
  })

  it('should return success swap. BUY', async () => {
    const ts = new Date().getTime()
    const expires = ts + Number(EXPIRES_QUOTE_MS!)
    const quote = quoteRepository.create(generateQuote({ ts, expires }))

    await quoteRepository.save(quote)

    const response = await supertest(app.getServer()).post(
      `/api/v1/quotes/${quote.id}/swap?action=BUY`
    )

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      action: 'BUY',
      quote: quote.id
    })
  })

  it('should return quote not found error', async () => {
    const ts = new Date().getTime()
    const expires = ts + Number(EXPIRES_QUOTE_MS!)
    const quote = quoteRepository.create(generateQuote({ ts, expires }))

    await quoteRepository.save(quote)

    const response = await supertest(app.getServer()).post(
      `/api/v1/quotes/70e7ba93-1765-4d29-b4c8-652bede161cb/swap?action=BUY`
    )

    expect(response.status).toEqual(404)
    expect(response.body).toMatchObject({
      message: 'Quote not found'
    })
  })

  it('should return expires quote error', async () => {
    const ts = new Date().getTime()
    const expires = ts
    const quote = quoteRepository.create(generateQuote({ ts, expires }))

    await quoteRepository.save(quote)

    const response = await supertest(app.getServer()).post(
      `/api/v1/quotes/${quote.id}/swap?action=BUY`
    )

    expect(response.status).toEqual(404)
    expect(response.body).toMatchObject({
      message: 'Expired Quote'
    })
  })

  it('should return "idQuote" error', async () => {
    const response = await supertest(app.getServer()).post('/api/v1/quotes/AA/swap?action=SELL')

    expect(response.status).toEqual(400)
    expect(response.body).toMatchObject({
      message: '"idQuote" must be a valid GUID'
    })
  })

  it('should return "action" error', async () => {
    const response = await supertest(app.getServer()).post(
      '/api/v1/quotes/2868de89-fe70-4bf9-92df-eab7fb947530/swap?action=Action'
    )

    expect(response.status).toEqual(400)
    expect(response.body).toMatchObject({
      message: '"action" must be one of [BUY, SELL]'
    })
  })

  it('should return quote not found', async () => {
    const response = await supertest(app.getServer()).post(
      '/api/v1/quotes/2868de89-fe70-4bf9-92df-eab7fb947530/swap?action=SELL'
    )

    expect(response.status).toEqual(404)
    expect(response.body).toMatchObject({
      message: 'Quote not found'
    })
  })

  afterAll(async () => {
    jest.clearAllMocks()
    await getConnection(NODE_ENV).close()
  })
})
