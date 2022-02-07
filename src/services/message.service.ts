import { getConnection, MoreThan } from 'typeorm'

import HttpException from '../exceptions/HttpException'
import { IMessage } from '../interfaces/message.interface'
import { IServiceResponse } from '../interfaces/serviceResponse.interface'
import { createInstance } from '../utils/request'
import Message from '../entities/message.entity'

const { TTL_MS, LIMIT_MSG, NODE_ENV } = process.env

class MessageService {
  private request = createInstance()

  private async getMessage(): Promise<IServiceResponse> {
    const request = await this.request.get(`/off/Tom/Everyone`)

    console.log(request)

    if (!request) throw new HttpException(409, 'Invalid request. Error in FOAAS')
    const response: IServiceResponse = request.data

    return response
  }

  public async get(userId: string): Promise<IMessage> {
    const msgRepository = getConnection(NODE_ENV).getRepository(Message)
    const since: number = new Date().getTime() - Number(TTL_MS)
    const messages: Array<IMessage> = (await msgRepository.find({
      where: { userId, ts: MoreThan(since) }
    })) as Array<IMessage>

    console.log(messages)

    if (messages.length > Number(LIMIT_MSG)) throw new HttpException(400, 'Exceeds message limit')

    const serviceMsg: IServiceResponse = await this.getMessage()

    const newMsg = msgRepository.create({
      userId,
      text: serviceMsg.message,
      ts: new Date().getTime()
    }) as IMessage

    await msgRepository.save(newMsg)

    return newMsg
  }
}

export default MessageService
