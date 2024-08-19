import { MOVING_END_POINT_SEGMENT } from './segments-for-end-points';

export const END_POINT_SETTINGS_EDITORS = '/settings-editors';
export const END_POINT_COLUMNS_EDITORS = '/columns';
export const END_POINT_SLOTS_EDITORS = '/slots';
export const END_POINT_SLOT_SLOTS_EDITORS = END_POINT_SLOTS_EDITORS + '/slot';
export const END_POINT_COLUMN_COLUMNS_EDITORS = END_POINT_COLUMNS_EDITORS + '/column';
export const END_POINT_MOVING_COLUMN_COLUMNS_EDITORS = END_POINT_COLUMN_COLUMNS_EDITORS + MOVING_END_POINT_SEGMENT;
