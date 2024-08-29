import { Schema } from 'mongoose';

const types = Schema.Types;

const options = {
  title: types.String,
	description: types.String,
	key: types.String,
	text: types.String
};

const schemaStatuse = new Schema(options, { _id: true });

export { schemaStatuse };