import { model } from 'mongoose';
import { schemaAccount } from '../schemas';
import { ACCOUNT_COLLECTION_NAME_DB } from '../core';

const modelAccount = model(ACCOUNT_COLLECTION_NAME_DB, schemaAccount);

export { modelAccount };
