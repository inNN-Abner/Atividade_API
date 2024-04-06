import { Request, Response } from 'express'
import User from '../../models/user.entity'
import Token from '../../models/token.entity'
import bcrypt from 'bcrypt'

export default class AuthControoler {
    static async store (req: Request, res: Response){
        const { name, email, password } = req.body;

        //Validação dos campos
        if(!name) return res.status(400).json({error: "Nome obrigatório!"});
        if(!email) return res.status(400).json({error: "E-mail obrigatório!"});
        if(!password) return res.status(400).json({error: "Senha obrigatória!"});

        //Instancia um novo usuário
        const user = new User();
        user.name = name;
        user.email = email;
        //'bcrypt.hasSync' é para encriptar a senha; (password, 10): O que é para encriptografar 'password' e a quantidade de rodadas de hash '10'
        user.password = bcrypt.hashSync(password, 10);  //O await para esperar o usuário salvar para voltar algo para ele, porque esta função é assíncrona
        await user.save();

        //Resposta para o usuário
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    }

    //Os passos abaixos são feitos depois de configurar as rotas
    static async login (req: Request, res: Response){
        const {email, password} = req.body;
        
        //Verificar se o campo e-mail|senha estão vazios
        if (!email || !password) return res.status(400).json({error: "E-mail e senha são campos obrigatórios"});
        
        const user = await User.findOneBy({email: email})
        if(!user) return res.status(401).json({error: "Usuário não encontrado!"});
        
        const passwordCheck = bcrypt.compareSync(password, user.password); //Ele está comparando a senha do corpo e do BD
        if(!passwordCheck) return res.status(401).json({error: "Senha inválida!"});

        //Remove todos os tokens antigos do usuário
        //Se o usuário for logar pelo PC, celular e afins, "simultanetamente", não deve deletar os tokens do usuário
        await Token.delete(
            {user: {id: user.id}}
        );

        //Criar um novo token
        const token = new Token();
        const stringRandom = Math.random().toString(36); //O '36' converte o número para a base 36 (binário, hexadecimal, ...)
        //O stringRandom é para gerar um texto aleatório; o '1' é a quantidade de rodadas; o 'slice' é para pegar apenas os últimos 16 números
        token.token = bcrypt.hashSync(stringRandom, 1).slice(-20);

        //Tempo para expirar o token
        token.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
            
        //Gera novo token para o usuário (após ele ser expirado) - Usado para não pedir o login novamento do usuário
        token.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
        token.user = user
        await token.save();

        return res.json({
            token: token.token, //Devolver o token
            expireAt: token.expiresAt, //Devolver quando ele expira
            refreshToken: token.refreshToken //Devolver o novo token
        });

        }
        static async refresh (req: Request, res: Response) {
            const { authorization } = req.headers
        
            if (!authorization) return res.status(400).json({ error: 'O refresh token é obrigatório' })
        
            const token = await Token.findOneBy({ refreshToken: authorization })
            if (!token) return res.status(401).json({ error: 'Refresh token inválido' })
        
            // Verifica se o refresh token ainda é válido
            if (token.expiresAt < new Date()) {
              await token.remove()
              return res.status(401).json({ error: 'Refresh token expirado' })
            }
        
            // Atualiza os tokens
            token.token = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
            token.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
            token.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
            await token.save()
        
            return res.json({
              token: token.token,
              expiresAt: token.expiresAt,
              refreshToken: token.refreshToken
            })
          }
        
          static async logout (req: Request, res: Response) {
            const { authorization } = req.headers
            
            if (!authorization) return res.status(400).json({ error: 'O token é obrigatório' })
        
            // Verifica se o token existe
            const userToken = await Token.findOneBy({ token: authorization })
            if (!userToken) return res.status(401).json({ error: 'Token inválido' })
        
            // Remove o token
            await userToken.remove()
        
            // Retorna uma resposta vazia
            return res.status(204).json()
    }
}    