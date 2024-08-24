import { model } from 'mongoose';
import { schemaWhatsNew } from '../schemas';
import { WHATS_NEW_COLLECTION_NAME_DB } from '../core';

const modelWhatsNew = model(WHATS_NEW_COLLECTION_NAME_DB, schemaWhatsNew);

export { modelWhatsNew };