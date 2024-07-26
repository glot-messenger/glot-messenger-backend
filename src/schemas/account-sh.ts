import { Schema } from 'mongoose';

const types = Schema.Types;

const options = {
	login: types.String,
	userName: types.String,
	password: types.String,
	repeatPassword: types.String,
	secretPhrase: types.String,
	acceptanceOfTermsPoliciesAndRules: types.Boolean
};

const schemaAccount = new Schema(options, { _id: true });

export { schemaAccount };
