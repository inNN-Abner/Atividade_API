import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Token from './token.entity'
import Task from './task.entity'
import Document from './documents.entity'
import Telephone from './telephone.entity'

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    email!: string

    @Column()
    password!: string
    
    @OneToMany(() => Token, token => token.user)
    tokens!: Token[]

    @OneToMany(() => Task, task => task.user)
    tasks!: Task[]

    @OneToMany(() => Document, document => document.user)
    documents!: Document[]

    @OneToMany(() => Telephone, telephone => telephone.user)
    telephones!: Telephone[]
}