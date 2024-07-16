import express, { Express, Request, Response } from 'express';
import process from 'node:process';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { routerChild } from './routes';

dotenv.config();

const APP: Express = express();

const PORT: string = process.env.PORT || '3000';
const MODE: string | undefined = process.env.NODE_ENV;

APP.use(bodyParser.json({ strict: false })); // для добавления body в request
APP.use('/api/v1', routerChild); // экземпляр дочернего роутера начинает подхватывать это начало

if (MODE && MODE === 'production') {
   console.log('Server is running in production MODE.');

   // Тут цепляется статика клиента;


} else {
   console.log('Server is running in development MODE.');
}

APP.get('/', (req: Request, res: Response) => {
   res.send('Express + backend TypeScript. Messenger GLOT. My Server! Work');
});

APP.listen(PORT, () => {
   console.log(`[SERVER]: SERVER STARTED http://localhost:${PORT}`);
});

async function startWork(): Promise<void> {
	try {
		console.log('Firebase cloud has been started...');

		// await mongoose.connect((isConfig ? config.get('mongoDbUrl') : process.env.MONGO_DB_URL));

		// APP.listen(PORT, function() {
		// 	console.log(`Server is running at ${(isConfig ? config.get('serverUrl') : process.env.SERVER_URL)}. His mode: ${MODE}.`);

		// 	initializationDB(MODE);
		// });

	} catch(err) {
		console.log('StartWork method error.', err);

		console.log('Server is not working or DB is not working. Try later...');

		process.exit(1);
	}
}

startWork();
