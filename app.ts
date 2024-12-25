import express, { Application, Request, Response, Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import routes from './routes/index';

dotenv.config();

const app:Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1',routes);

app.get('/',(req:Request,res:Response) => {
    res.send("Bugik API is working");
})

app.use((req:Request,res:Response) => {
    res.status(404).json({message: "Endpoint not found"});
})

app.listen(PORT , () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

export default app;

