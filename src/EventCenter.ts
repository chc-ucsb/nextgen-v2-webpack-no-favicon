import { Dictionary } from './@types';
import { objPropExists } from './helpers/object';

/**
 * Enum of valid events. All events *must* be listed here!!
 */
export enum EventTypes {
  EVENT_TOC_LAYER_CONFIGURATION_CREATED = 'EVENT_TOC_LAYER_CONFIGURATION_CREATED',
  EVENT_TOC_LAYER_CONFIGURATION_UPDATED = 'EVENT_TOC_LAYER_CONFIGURATION_UPDATED',
  EVENT_TOC_LAYER_CQL_FILTER_UPDATED = 'EVENT_TOC_LAYER_CQL_FILTER_UPDATED',
  EVENT_LAYER_CONFIGURATION_FEATUREINFO_FETCHING = 'EVENT_LAYER_CONFIGURATION_FEATUREINFO_FETCHING',
  EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED = 'EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED',
  EVENT_LAYER_CONFIGURATION_ELEVATION_FETCHING = 'EVENT_LAYER_CONFIGURATION_ELEVATION_FETCHING',
  EVENT_LAYER_CONFIGURATION_ELEVATION_UPDATED = 'EVENT_LAYER_CONFIGURATION_ELEVATION_UPDATED',
  EVENT_MAPWINDOW_FOCUSED = 'EVENT_MAPWINDOW_FOCUSED',
  EVENT_MAPWINDOW_RESIZED = 'EVENT_MAPWINDOW_RESIZED',
  EVENT_MAPWINDOW_CREATED = 'EVENT_MAPWINDOW_CREATED',
  EVENT_MAPWINDOW_DESTROYED = 'EVENT_MAPWINDOW_DESTROYED',
  EVENT_REQUESTING_NEW_MAP_WINDOW = 'EVENT_REQUESTING_NEW_MAP_WINDOW',
  EVENT_MAPWINDOW_LAYER_CONFIGURATION_UPDATED = 'EVENT_MAPWINDOW_LAYER_CONFIGURATION_UPDATED',
  EVENT_REQUEST_TOOLS_DRAWER_OPEN = 'EVENT_REQUEST_TOOLS_DRAWER_OPEN',
  EVENT_REGION_CHANGED = 'EVENT_REGION_CHANGED',
  EVENT_SPATIAL_LOCKING_WINDOW_UPDATED = 'EVENT_SPATIAL_LOCKING_WINDOW_UPDATED',
}

/**
 * Handles all creation and tracking of event handlers used by the application.
 */
export class EventHandler {
  callbacksForEventDictionary: Dictionary = {};
  callbackObjectsForEventDictionary: Dictionary = {};
  types: typeof EventTypes = EventTypes;

  /**
   * Execute a requested event handler.
   * @param {string} eventName
   * @param {Dictionary | string} eventObject
   * @param {Dictionary} postingObject
   */
  postEvent(eventName: string, eventObject: Dictionary | string, postingObject: Dictionary): void {
    if (objPropExists(this.callbacksForEventDictionary, eventName)) {
      /*
       * In case more events of this type are registered during this events execution,
       * take a copy of only the events that exists at the time of execution.
       */
      const callbacksForEventNameCopy: Dictionary = [];
      const callbackObjectsForEventNameCopy: Dictionary = [];
      const callbacksForEventName = this.callbacksForEventDictionary[eventName];
      const callbackObjectsForEventName = this.callbackObjectsForEventDictionary[eventName];

      callbacksForEventName.map((callback: Function, idx: number) => {
        callbacksForEventNameCopy.push(callback);
        callbackObjectsForEventNameCopy.push(callbackObjectsForEventName[idx]);
      });

      callbackObjectsForEventNameCopy.map((obj: Dictionary, idx: number) => {
        const callback = callbacksForEventNameCopy[idx];
        const callbackObject = callbackObjectsForEventNameCopy[idx];
        callback(eventObject, callbackObject, postingObject);
      });
    }
  }

  /**
   * Register a callback event handler.
   * @param {string} eventName
   * @param {Function} callback
   * @param {Dictionary} callbackObject
   */
  registerCallbackForEvent(eventName: string, callback: Function, callbackObject: Dictionary): void {
    if (Object.prototype.hasOwnProperty.call(this.callbacksForEventDictionary, eventName)) {
      this.callbacksForEventDictionary[eventName].push(callback);
      this.callbackObjectsForEventDictionary[eventName].push(callbackObject);
    } else {
      this.callbacksForEventDictionary[eventName] = [];
      this.callbacksForEventDictionary[eventName].push(callback);

      this.callbackObjectsForEventDictionary[eventName] = [];
      this.callbackObjectsForEventDictionary[eventName].push(callbackObject);
    }
  }

  /**
   * Remove all callbacks for a given registered callback object.
   * @param {Dictionary} callbackObjectToRemove
   */
  removeAllCallbacksForObject(callbackObjectToRemove: Dictionary): void {
    Object.keys(this.callbacksForEventDictionary).map((aKey) => {
      // Get the array for the key and check if callbackObject is in it
      const callbackObjectsForEventArray = this.callbackObjectsForEventDictionary[aKey];
      let indexToRemove = -1;

      callbackObjectsForEventArray.map((obj: Dictionary, idx: number) => {
        if (obj === callbackObjectToRemove) {
          indexToRemove = idx;
        }
      });

      if (indexToRemove > -1) {
        this.callbackObjectsForEventDictionary[aKey].splice(indexToRemove, 1);
        this.callbacksForEventDictionary[aKey].splice(indexToRemove, 1);
      }
    });
  }
}
