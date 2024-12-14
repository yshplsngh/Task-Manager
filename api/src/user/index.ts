import type { Express, Request, Response } from "express";

export default function(app:Express){
    app.get('/api/user',(req:Request,res:Response)=>{
        return res.status(200).json(res.locals.user || { message: 'no login user' });
    })
}