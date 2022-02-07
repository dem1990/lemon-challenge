import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class Message {
  @PrimaryGeneratedColumn('uuid')
  public id?: string

  @Column()
  public userId?: string

  @Column()
  public text?: string

  @Column({ type: 'bigint' })
  public ts?: number
}

export default Message
