import { NextFunction, Request, Response } from 'express'

import HttpException from '../exceptions/HttpException'
import { IMessage } from '../interfaces/message.interface'
import messageService from '../services/message.service'

class MessageController {
  private messageService = new messageService()

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.headers.userid as string

      if (!userId) throw new HttpException(400, 'userId is required')

      const message: IMessage = await this.messageService.get(userId)

      return res.status(200).json(message)
    } catch (error) {
      next(error)
    }
  }
}

export default MessageController
