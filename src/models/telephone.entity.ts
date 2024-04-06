import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import User from './user.entity'

@Entity()
export default class Telephone extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  operator!: string

  @Column()
  tel_number!: string
  
  @Column({name: 'user_id'})
  userId!: number
  
  @ManyToOne(() => User, user => user.telephones)
  user!: User
}