import { LayerJSONConfig, RegionConfig, RegionID, VersionConfig, VersionID } from '../@types';

export const dateHelpers = {
  threeLetterMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fullMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  dateDefinitionMapping: {
    yyyy: (date: Date): number => {
      return date.getFullYear();
    },
    yy(date: Date): string {
      return date.getFullYear().toString().slice(2);
    },
    m(date: Date): number {
      return date.getMonth() + 1;
    },
    mm(date: Date): string | number {
      const month = date.getMonth() + 1;
      if (month < 10) {
        return `0${month}`;
      }
      return month;
    },
    MM(date: Date): string {
      return dateHelpers.threeLetterMonths[date.getMonth()];
    },
    MMM(date: Date): string {
      return dateHelpers.fullMonths[date.getMonth()];
    },
    D: (date: Date): number => {
      return date.getDate();
    },
    d: (date: Date): number => {
      return date.getDate();
    },
    dd(date: Date): string | number {
      const day = date.getDate();
      if (day < 10) {
        return `0${day}`;
      }
      return day;
    },
  },

  formatDate(date: Date, format: string): string {
    let _format = format;
    for (const dateFormat of Object.keys(this.dateDefinitionMapping)) {
      if (_format.includes(`{${dateFormat}}`)) {
        _format = _format.replace(`{${dateFormat}}`, this.dateDefinitionMapping[dateFormat](date));
      }
    }
    return _format;
  },
};

/**
 * Pause execution for a given amount of milliseconds.
 * @param {number} milliseconds
 */
export const sleep = (milliseconds: number): void => {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i += 1) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
};

/**
 * Find and return a given region ID. Returns `null` if it is not found.
 * @param {RegionID} regionID The region ID to find.
 * @returns {RegionConfig | null}
 */
export const getRegionWithRegionID = (regionID: RegionID): RegionConfig | null => {
  return globalThis.App.Config.sources.regions.find((region) => region.id === regionID) || null;
};

/**
 * Find and return a given version ID. Returns `null` if it is not found.
 * @param {VersionID} versionID The version ID to find.
 * @returns {VersionConfig | null}
 */
export const getVersionWithVersionID = (versionID: VersionID): VersionConfig | null => {
  return globalThis.App.Config.sources.versions.find((version) => version.id === versionID) || null;
};

/**
 * Get the array index of a given region ID
 * @param {RegionID} regionID The region ID to find the index of.
 * @returns {number}
 */
export const getRegionIndexWithRegionID = (regionID: RegionID): number | null => {
  let foundRegionIndex = null;

  for (const regionIndex of globalThis.App.Config.sources.regions) {
    const region = globalThis.App.Config.sources.regions[regionIndex];

    if (region.id === regionID) {
      foundRegionIndex = regionIndex;
    }
  }

  return foundRegionIndex;
};

/**
 * Get the array index of a given version ID
 * @param {VersionID} versionID The version ID to find the index of.
 * @returns {number}
 */
export const getVersionIndexWithVersionID = (versionID: VersionID): number | null => {
  let foundVersionIndex = null;

  for (const versionIndex of globalThis.App.Config.sources.versions) {
    const version = globalThis.App.Config.sources.versions[versionIndex];

    if (version.id === versionID) {
      foundVersionIndex = versionIndex;
    }
  }

  return foundVersionIndex;
};

export const updateArrayInMap = <T>(map: Map<T, Array<any>>, index: T, data: any): Map<T, Array<any>> => {
  const arr = map.get(index) || [];
  arr.push(data);

  return map.set(index, arr);
};

export const hasAnyLayerDisplayAttributesChangedBetweenTheseTwoConfigs = (oldConfig: LayerJSONConfig, newConfig: LayerJSONConfig): boolean => {
  let didADisplayAttributeChange = false;

  const oldLayers = globalThis.App.Layers.query(oldConfig, { type: 'layer' }, ['overlays', 'boundaries']);
  const newLayers = globalThis.App.Layers.query(newConfig, { type: 'layer' }, ['overlays', 'boundaries']);
  const { length } = newLayers; // It can be either they are same size
  for (let xx = 0; xx < length; xx += 1) {
    const oldLayer = oldLayers[xx];
    const newLayer = newLayers[xx];

    if (!oldLayer || !newLayer || oldLayer.display !== newLayer.display) {
      didADisplayAttributeChange = true;
    }
    // didADisplayAttributeChange = (!oldLayer || !newLayer || oldLayer.display !== newLayer.display)
  }

  return didADisplayAttributeChange;
};
