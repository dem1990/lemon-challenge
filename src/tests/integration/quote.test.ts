import 'dotenv/config'
import 'reflect-metadata'
import { Connection, getConnection } from 'typeorm'
import supertest from 'supertest'

import App from '../../app'
import Routes from '../../routes'
import config from '../../database'
import { generateOrderBook } from '../mocks'

const { NODE_ENV, SERVICE_FEE, OKEX_FEE_A, OKEX_FEE_B } = process.env

jest.mock('axios', () => ({
  create: () => ({
    get: () => generateOrderBook()
  })
}))

describe('Test quote service', () => {
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

  it('should return BTC-USDT success quote', async () => {
    const response = await supertest(app.getServer()).get(
      '/api/v1/quotes?pair=BTC-USDT&volume=0.001'
    )
    const orderBookMock = generateOrderBook()
    const asks = orderBookMock.data.data[0].asks
    const bids = orderBookMock.data.data[0].bids

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      sell: Number(asks[0][0]) * (Number(OKEX_FEE_A!) + Number(SERVICE_FEE!) + 1),
      buy: Number(bids[0][0]) * (1 - Number(OKEX_FEE_A!) - Number(SERVICE_FEE!)),
      pair: 'BTC-USDT',
      volume: 0.001
    })
  })

  it('should return BTC-USDT success quote with slippage', async () => {
    const response = await supertest(app.getServer()).get('/api/v1/quotes?pair=BTC-USDT&volume=2.5')
    const orderBookMock = generateOrderBook()
    const asks = orderBookMock.data.data[0].asks
    const bids = orderBookMock.data.data[0].bids
    // eslint-disable-next-line prettier/prettier
    const sell = (Number(asks[0][0]) + (Number(asks[1][0]) * 1.5))/ 2.5
    const buy = Number(bids[0][0])

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      sell: sell * (Number(OKEX_FEE_A!) + Number(SERVICE_FEE!) + 1),
      buy: buy * (1 - Number(OKEX_FEE_A!) - Number(SERVICE_FEE!)),
      pair: 'BTC-USDT',
      volume: 2.5
    })
  })

  it('should return ETH-USDT success quote', async () => {
    const response = await supertest(app.getServer()).get(
      '/api/v1/quotes?pair=ETH-USDT&volume=0.001'
    )
    const orderBookMock = generateOrderBook()
    const asks = orderBookMock.data.data[0].asks
    const bids = orderBookMock.data.data[0].bids

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      sell: Number(asks[0][0]) * (Number(OKEX_FEE_A!) + Number(SERVICE_FEE!) + 1),
      buy: Number(bids[0][0]) * (1 - Number(OKEX_FEE_A!) - Number(SERVICE_FEE!)),
      pair: 'ETH-USDT',
      volume: 0.001
    })
  })

  it('should return AAVE-USDT success quote', async () => {
    const response = await supertest(app.getServer()).get(
      '/api/v1/quotes?pair=AAVE-USDT&volume=0.001'
    )
    const orderBookMock = generateOrderBook()
    const asks = orderBookMock.data.data[0].asks
    const bids = orderBookMock.data.data[0].bids

    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      sell: Number(asks[0][0]) * (Number(OKEX_FEE_B!) + Number(SERVICE_FEE!) + 1),
      buy: Number(bids[0][0]) * (1 - Number(OKEX_FEE_B!) - Number(SERVICE_FEE!)),
      pair: 'AAVE-USDT',
      volume: 0.001
    })
  })

  it('should return volume exceeds liquidity error', async () => {
    const response = await supertest(app.getServer()).get(
      '/api/v1/quotes?pair=BTC-USDT&volume=1000'
    )

    expect(response.status).toEqual(409)
    expect(response.body).toMatchObject({
      message: 'Volume exceeds liquidity'
    })
  })

  it('should return "pair" error', async () => {
    const response = await supertest(app.getServer()).get(
      '/api/v1/quotes?pair=BTC-USD&volume=0.001'
    )

    expect(response.status).toEqual(400)
    expect(response.body).toMatchObject({
      message: '"pair" must be one of [BTC-USDT, ETH-USDT, AAVE-USDT]'
    })
  })

  it('should return "volume" error', async () => {
    const response = await supertest(app.getServer()).get('/api/v1/quotes?pair=BTC-USDT&volume=A')

    expect(response.status).toEqual(400)
    expect(response.body).toMatchObject({
      message: '"volume" must be a number'
    })
  })

  afterAll(async () => {
    jest.clearAllMocks()
    await getConnection(NODE_ENV).close()
  })
})
