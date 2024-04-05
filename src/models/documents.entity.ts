import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from './user.entity';

@Entity()
export default class Documents extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  number!: string

  @Column()
  type!: string
  
  @Column({name: 'user_id'})
  userId!: number
  
  @ManyToOne(() => User, user => user.documents)
  user!: User
}