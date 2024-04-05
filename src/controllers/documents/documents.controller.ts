import { Request, Response } from 'express'
import Documents from '../../models/documents.entity'
import Task from '../../models/documents.entity';

export default class DocumentsController {

  //C R I A R
  static async store (req: Request, res: Response) {
    const { number, type } = req.body
    const { userId } = req.headers

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    if (!number || !type) {
      return res.status(400).json({ error: 'O título é obrigatório!' })
    }

    const documents = new Documents()
    documents.number = number
    documents.type = type
    documents.userId = Number(userId)
    await documents.save()

    return res.status(201).json(documents)
  }

  //L I S T A R
  static async index (req: Request, res: Response) {
    const { userId } = req.headers

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const documents = await Documents.find({where: { userId: Number(userId) }})
    return res.json(documents)
  }

  //V I S U A L I Z A R
  static async show (req: Request, res: Response) {
    const { id } = req.params
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório!' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const documents = await Documents.findOneBy({id: Number(id), userId: Number(userId)})
    return res.json(documents)
  }
  
  //A T U A L I Z A R
  static async update (req: Request, res: Response) {
    const { id } = req.params
    const { number, type } = req.body
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório!' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const documents = await Documents.findOneBy({id: Number(id), userId: Number(userId)})
    if (!documents) {
      return res.status(404).json({ error: 'Documento não encontrado!' })
    }

    documents.type = type ?? documents.type
    documents.type = (type === undefined) ? documents.type : type
    await documents.save()

    return res.json(documents)
  } 

  // D E L E T A R
  static async delete (req: Request, res: Response) {
    const { id } = req.params
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório!' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const documents = await Documents.findOneBy({id: Number(id), userId: Number(userId)})
    if (!documents) {
      return res.status(404).json({ error: 'Documento não encontrado!' })
    }

    await documents.remove()
    return res.status(204).json()
  }
}