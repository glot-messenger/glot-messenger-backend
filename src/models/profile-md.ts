import { model } from 'mongoose';
import { schemaProfile } from '../schemas';
import { PROFILE_COLLECTION_NAME_DB } from '../core';

const modelProfile = model(PROFILE_COLLECTION_NAME_DB, schemaProfile);

export { modelProfile };
