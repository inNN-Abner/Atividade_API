import { Request, Response, NextFunction } from 'express';
import Token from '../models/token.entity';

export default async function authMiddleware (req: Request, res: Response, next: NextFunction){ 
    const{ authorization } = req.headers;

    if(!authorization) return res.status(401).json({error: "Token não informado!"});

    const userToken = await Token.findOneBy({token: authorization});
    if(!userToken) return res.status(401).json();

    //O 'expires.at' foi criado antes: ele é uma data do futuro, por isso, se for menor que a data atual o token está espirado
    if(userToken.expiresAt < new Date()){
    await userToken.remove(); //Apaga o token do BD
    return res.status(401).json();
    }

    req.headers.userId = userToken.userId.toString();
    next(); //Informa que o programa pode ir para a próxima função
}