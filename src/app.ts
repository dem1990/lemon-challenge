import express from 'express'
import cors from 'cors'
import { ConnectionOptions, createConnection } from 'typeorm'
import morgan from 'morgan'

import Routes from './interfaces/routes.interface'
import errorMiddleware from './middlewares/error.middleware'
import notFoundMiddleware from './middlewares/notFound.middleware'

const { PORT } = process.env

class App {
  public app: express.Application
  public port: string | number

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = PORT || 3000
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeErrorHandling()
    this.intializeNotFoundHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`)
    })
  }

  public getServer() {
    return this.app
  }

  public async connectToDatabase(config: ConnectionOptions) {
    try {
      await createConnection(config)
      console.log('🟢 The database is connected.')
    } catch (error) {
      console.log(`🔴 Unable to connect to the database: ${error}.`)
    }
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(morgan('dev'))
    this.app.use(cors({ origin: true, credentials: true }))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.map((route) => {
      this.app.use('/', route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private intializeNotFoundHandling() {
    this.app.use(notFoundMiddleware)
  }
}

export default App
