import { Request, Response } from 'express'
import Telephone from '../../models/telephone.entity'

export default class TelephoneController {

  //C R I A R
  static async store (req: Request, res: Response) {
    const { operator, tel_number } = req.body
    const { userId } = req.headers

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    if (!operator || !tel_number) {
      return res.status(400).json({ error: 'A operador e o número de telefone são obrigatórios!' })
    }

    const telephone = new Telephone()
    telephone.operator = operator
    telephone.tel_number = tel_number
    telephone.userId = Number(userId)
    await telephone.save()

    return res.status(201).json(telephone)
  }

  //L I S T A R
  static async index (req: Request, res: Response) {
    const { userId } = req.headers

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const telephone = await Telephone.find({where: { userId: Number(userId) }})
    return res.json(telephone)
  }

  //V I S U A L I Z A R
  static async show (req: Request, res: Response) {
    const { id } = req.params
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório!' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const telephone = await Telephone.findOneBy({id: Number(id), userId: Number(userId)})
    return res.json(telephone)
  }
  
  //A T U A L I Z A R
  static async update (req: Request, res: Response) {
    const { id } = req.params
    const { operator, tel_number } = req.body
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório!' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const telephone = await Telephone.findOneBy({id: Number(id), userId: Number(userId)})
    if (!telephone) {
      return res.status(404).json({ error: 'Número de telefone não encontrado!' })
    }

    telephone.operator = operator ?? telephone.operator
    telephone.tel_number = (tel_number === undefined) ? telephone.tel_number : tel_number
    await telephone.save()

    return res.json(telephone)
  } 

  // D E L E T A R
  static async delete (req: Request, res: Response) {
    const { id } = req.params
    const { userId } = req.headers

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O id é obrigatório!' })
    }

    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado!' })

    const telephone = await Telephone.findOneBy({id: Number(id), userId: Number(userId)})
    if (!telephone) {
      return res.status(404).json({ error: 'Número de telefone não encontrado!' })
    }

    await telephone.remove()
    return res.status(204).json()
  }
}