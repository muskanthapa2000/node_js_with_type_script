import express, { Request, Response } from 'express';


const app = express()


app.use(express.json())


const port = 40


app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!')
    }
)


app.listen(8080, ()=>{
    console.log(`listening on 8080`);
})
