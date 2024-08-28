import { Schema } from 'mongoose';
import { ACCOUNT_COLLECTION_NAME_DB } from '../core';

const types = Schema.Types;

const options = {
	login: types.String,
	timeCreatedInMs: types.Number,
	userName: types.String,
	password: types.String,
	repeatPassword: types.String,
	secretPhrase: types.String,
	acceptanceOfTermsPoliciesAndRules: types.Boolean,
	mountedAccounts: [
		{
			type: types.ObjectId,
			ref: ACCOUNT_COLLECTION_NAME_DB,
			required: false
		}
	]
};

const schemaAccount = new Schema(options, { _id: true });

export { schemaAccount };
