import 'dotenv/config'
import 'reflect-metadata'
import config from './database'
import App from './app'
import Routes from './routes'

const app = new App([new Routes()])

app.connectToDatabase(config)
app.listen()
