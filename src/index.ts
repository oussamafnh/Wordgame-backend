import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';

import router from './router';


const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


const server = http.createServer(app);


server.listen(8090, () => {
    console.log("Server running");
});


const MONGO_URL = 'mongodb+srv://fannahoussama4:NKALAEwCqKzDV3Lr@wordsgame.eqzi93a.mongodb.net/?retryWrites=true&w=majority&appName=wordsgame';


mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error:Error) => console.log(error)); 


app.use('/', router());