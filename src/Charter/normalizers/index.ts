import { normalizeGefsData } from './normalizeGefsData';
import { normalizeG5Data } from './normalizeG5Data';
import { normalizeSnowData } from './normalizeSnowData';
import { normalizeSoilMoistureData } from './normalizeSoilMoistureData';
import { normalizeNDVI10DayCompositeData } from './normalizeNDVI10DayCompositeData';

export * from './normalizeGefsData';
export * from './normalizeG5Data';
export * from './normalizeSnowData';
export * from './normalizeSoilMoistureData';
export * from './normalizeNDVI10DayCompositeData';

export const ChartNormalizers = {
  normalizeGefsData,
  normalizeG5Data,
  normalizeSnowData,
  normalizeSoilMoistureData,
  normalizeNDVI10DayCompositeData,
};
