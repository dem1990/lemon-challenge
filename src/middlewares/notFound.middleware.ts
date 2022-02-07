import { NextFunction, Request, Response } from 'express'

import HttpException from '../exceptions/HttpException'

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req)
    throw new HttpException(404, 'resource not found')
  } catch (error) {
    next(error)
  }
}

export default notFoundMiddleware
