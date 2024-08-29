import express, { Express } from 'express';
import mongoose from 'mongoose';
import process from 'node:process';
import path from 'node:path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { routerChild } from './routes';
import cors from 'cors';
import config from 'config';
import { initializationDB } from './initialization-db';

dotenv.config();

const APP: Express = express();

const PORT: string = process.env.PORT || config.get('portServer') || '8080';
const MODE: string | undefined = process.env.NODE_ENV;

const arrKeysConfig: string[] = Object.keys(config);
const isConfig: boolean = arrKeysConfig.length > 0;

const corsOptions = {
	origin: '*',
	credentials: true,
	optionSuccessStatus: 200
};

APP.use(cors(corsOptions)); // для решения проблем с CORS
APP.use(bodyParser.json({ strict: false })); // для добавления body в request
APP.use('/api/v1', routerChild); // экземпляр дочернего роутера начинает подхватывать это начало

// Временно - цепляем статику
APP.use('/assets', express.static(path.join(__dirname, 'assets')));

if (MODE && MODE === 'production') {
	console.log('Server is running in production MODE.');

	// Тут цепляется статика клиента;

} else {
	console.log('Server is running in development MODE.');
}

async function startWork(): Promise<void> {
	try {
		console.log('MongoDB has been started...');

		await mongoose.connect(config.get('urlDB'));

		APP.listen(PORT, function () {
			console.log(`Server is running at ${(isConfig ? config.get('urlServer') : process.env.SERVER_URL)}. His mode: ${MODE}.`);

			// initializationDB();
		});

	} catch (err) {
		console.log('StartWork method error.', err);

		console.log('Server is not working or DB is not working. Try later...');

		process.exit(1);
	}
}

startWork();
