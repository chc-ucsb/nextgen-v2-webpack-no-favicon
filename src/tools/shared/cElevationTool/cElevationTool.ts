import { Http2ServerRequest } from 'http2';
import { dataUriToBlob, getRandomString } from '../../../helpers/string';
import { toLonLat } from 'ol/proj';

export const cElevationTool = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  createExtendedTool: function (owningBlock) {
    const toolUniqueID = getRandomString(32, 36);

    const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');

    const extendedTool = {

      owningBlock: owningBlock,
      toggleGroupId: mapWindowBlock.extendedTool.toggleGroupId,
      //extTool : extElevationTool,
      //after this gets given away to the toolbar it is copied
      //and can no longer be referenced from this object
      //directly
      //you have to use Ext.getCmp(this.extElevationToolID);
      //to access it
      //dont forget that

      extToolID: toolUniqueID,
      elevationToolMapClickListenerCallbackFunction: async function (eventObject, mapWindow) {
        //tools act upon the mapwindow
        //so this elevation tool should
        //get the mapclick event and then modify the
        //featureinfo then post the featureInfoAvailable event

        const event = eventObject;
        const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;
        const mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;

        const isPressed = this.component.pressed;
        if (isPressed) {
          let layer;

          if ((layer = globalThis.App.OpenLayers.getCrosshairLayer(map))) {
            map.removeLayer(layer);
          }

          const crossHairLayer = globalThis.App.OpenLayers.drawCrossHair(event.coordinate);
          map.addLayer(crossHairLayer);

          //convert event coordinates to latitude and longitude
          var coords = toLonLat(event.coordinate);
      
          //create request settings object
          var f = {
            x: coords[0],
            y: coords[1],
            units: "feet",
            output: "json"
          }

          var headers = {
            "Content-Type": "application/x-www-form-urlencoded",
          }

          //create request URL
          var requestURL = "https://nationalmap.gov/epqs/pqs.php?x=" + f.x + "&y=" + f.y + "&units=" + f.units + "&output=" + f.output;

          var settings = {
            async: true,
            crossDomain: true,
            url: requestURL,
            method: "GET",
            headers: headers
          }

          fetch(settings.url, settings)
          .then(data=>{return data.json()})
          .then(res=>{
            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_ELEVATION_FETCHING, res, this);
            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_ELEVATION_UPDATED, res, this);
          })
          .catch(error=>{console.log(error)})  
        }
      },
    };

    mapWindowBlock.on(
      'click',
      function (callbackObj, postingObj, event) {
        const extendedTool = callbackObj;
        const mapperWindow = postingObj;

        extendedTool.elevationToolMapClickListenerCallbackFunction(event, mapperWindow);
      },
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extElevationTool = {
      extendedTool: extendedTool,
      cls: 'x-btn-left',
      iconCls: 'fa ' + 'fa-map-marker',
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      toggleGroup: extendedTool.toggleGroupId,
      id: extendedTool.extToolID,
      pressed: block.pressed,
      listeners: {
        toggle: function () {
          if (!this.priorToggle && this.pressed) {
            this.priorToggle = true;
          } else if (this.priorToggle && !this.pressed) {
            this.priorToggle = false;
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return extElevationTool;
  },
};
