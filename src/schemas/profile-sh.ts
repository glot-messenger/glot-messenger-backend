import { Schema } from 'mongoose';

const types = Schema.Types;

const options = {
   userName: types.String,
	userLastName: types.String,
	note: types.String,
	imageName: types.String,
	status: {
		
	}
};

const schemaProfile = new Schema(options, { _id: true });

export { schemaProfile };
