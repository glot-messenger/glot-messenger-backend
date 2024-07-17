import express, { Request, Response } from 'express';

const routerColumnsEditors = express.Router({ mergeParams: true });

routerColumnsEditors.post('/', async(req: Request, res: Response) => {
	const { settingId } = req.body;

	console.log(settingId, '!!!');

	if (!settingId) {
		res.status(400).send({
			columnsEditor: null
		});

		return;
	}
});

export { routerColumnsEditors };
