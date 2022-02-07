import { Router } from 'express'

import MessageController from '../controllers/message.controller'
import Route from '../interfaces/routes.interface'

class Routes implements Route {
  public path = '/api/v1'
  public router = Router()
  public messageController = new MessageController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/message`, this.messageController.get)
  }
}

export default Routes
