import { Request, Response } from 'express'
import Task from '../../models/task.entity'

export default class TaskController {

  //C R I A R
  static async store (req: Request, res: Response) {
    const { title, completed } = req.body
    const { userId } = req.headers

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    if (!title) {
      return res.status(400).json({ error: 'O título é obrigatório' })
    }

    const task = new Task()
    task.title = title
    task.completed = completed ?? false
    task.userId = Number(userId)
    await task.save()

    return res.status(201).json(task)
  }

  //L I S T A R
  static async index (req: Request, res: Response) {
    const { userId } = req.headers

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    const tasks = await Task.find({where: { userId: Number(userId) }})
    return res.json(tasks)
  }

  //V I S U A L I Z A R
  static async show (req: Request, res: Response) {
    const { id } = req.params
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    const task = await Task.findOneBy({id: Number(id), userId: Number(userId)})
    return res.json(task)
  }
  
  //A T U A L I Z A R
  static async update (req: Request, res: Response) {
    const { id } = req.params
    const { title, completed } = req.body
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    const task = await Task.findOneBy({id: Number(id), userId: Number(userId)})
    if (!task) {
      return res.status(404).json({ error: 'Task não encontrada' })
    }

    task.title = title ?? task.title
    task.completed = (completed === undefined) ? task.completed : completed
    await task.save()

    return res.json(task)
  } 

  // D E L E T A R
  static async delete (req: Request, res: Response) {
    const { id } = req.params
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

    const task = await Task.findOneBy({id: Number(id), userId: Number(userId)})
    if (!task) {
      return res.status(404).json({ error: 'Task não encontrada' })
    }

    await task.remove()
    return res.status(204).json()
  }
}