import { model } from 'mongoose';
import { schemaStatuse } from '../schemas';
import { STATUSE_COLLECTION_NAME_DB } from '../core';

const modelStatuse = model(STATUSE_COLLECTION_NAME_DB, schemaStatuse);

export { modelStatuse };
