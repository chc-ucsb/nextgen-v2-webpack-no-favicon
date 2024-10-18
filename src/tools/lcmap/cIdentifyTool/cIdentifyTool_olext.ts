import Toggle from 'ol-ext/control/Toggle';
import Popup from 'ol-ext/overlay/Popup';
import { roundValue } from '../../../helpers/math';
import { isUrl } from '../../../helpers/validation';

export const cIdentifyTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const owningBlock = extendedTool.owningBlock;
    let toggle;

    const getIdentifyToggleButton = ({ map }) => {
      const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');

      let popup = new Popup({
        popupClass: 'default',
        closeBox: true,
        onshow: function () {},
        onclose: function () {
          const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
          if (layer) map.removeLayer(layer);
        },
        positioning: 'right',
      });

      popup.element.classList.add('featurePopup'); // We want the default class AND our custom class

      toggle = new Toggle({
        html: '<i class="ms ms-identify"></i>',
        className: 'select',
        title: 'Identify',
        active: block.pressed,
        onToggle: (isToggled: boolean) => {
          if (isToggled) {
            map.extendedTool.component.activeDataQueryComponent = 'identify';
            map.addOverlay(popup);
            popup.hide();
          } else {
            map.extendedTool.component.activeDataQueryComponent = '';
            const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
            if (layer) map.removeLayer(layer);
            popup.hide();
          }
        },
      });

      mapWindowBlock.on('click', async function (callbackObj, postingObj, event) {
        if (block.pressed && toggle.getActive()) {
          map.extendedTool.component.activeDataQueryComponent = 'identify';
          map.addOverlay(popup);
          popup.hide();
          // block.pressed = false;
        }
        if (map.extendedTool.component.activeDataQueryComponent === 'identify' || toggle.getActive()) {
          const mapWindow = postingObj;

          const layerConfigId = mapWindow.layersConfigId;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(layerConfigId);

          const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
          if (layer) map.removeLayer(layer);

          const crossHairLayer = globalThis.App.OpenLayers.drawCrossHair(event.coordinate);
          map.addLayer(crossHairLayer);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_FETCHING, mapWindow, this);

          const newLayerConfig = await globalThis.App.OpenLayers.updateLayerConfigWithFeatureInfoForCoord(event.coordinate, map, layersConfig);

          globalThis.App.Layers.setLayersConfigInstanceToId(layerConfigId, newLayerConfig);

          const layersFeatureInfos = globalThis.App.Layers.query(
            newLayerConfig,
            {
              featureInfo: '*',
              display: true,
              loadOnly: false,
              mask: false,
            },
            ['overlays', 'boundaries', 'additional']
          );

          const layersFeatureInfoLoadOnly = globalThis.App.Layers.query(
            newLayerConfig,
            {
              featureInfo: '*',
              display: false,
              loadOnly: true,
              mask: false,
            },
            ['overlays', 'boundaries', 'additional']
          );

          layersFeatureInfos.push.apply(layersFeatureInfos, layersFeatureInfoLoadOnly);

          // Check if layer isPrimaryFeature, if so move it to END of array to display first (info panels build as a stack)
          for (let index in layersFeatureInfos) {
            const layer = layersFeatureInfos[index];
            if (layer.isPrimaryFeature) layersFeatureInfos.splice(layersFeatureInfos.length - 1, 0, layersFeatureInfos.splice(index, 1)[0]);
          }

          let content = '';

          for (let index in layersFeatureInfos) {
            let sectionToUse = null;
            const layerWithFeatureInfo = layersFeatureInfos[index];

            let onLayers = globalThis.App.Layers.query(newLayerConfig.boundaries, { id: layersFeatureInfos[index].id });
            if (onLayers.length > 0) sectionToUse = newLayerConfig.boundaries;

            onLayers = globalThis.App.Layers.query(newLayerConfig.overlays, { id: layersFeatureInfos[index].id });
            if (onLayers.length > 0) sectionToUse = newLayerConfig.overlays;

            onLayers = globalThis.App.Layers.query(newLayerConfig.additional, { id: layersFeatureInfos[index].id });
            if (onLayers.length > 0) sectionToUse = newLayerConfig.additional;

            // Add header title of name of layer and start the table - split removes suffix date
            content += `<b><h4 class="featurePopupTitle">${
              globalThis.App.Layers.getDisplayNameForLayer(layersFeatureInfos[index], sectionToUse).split('(')[0]
            }</h4></b><br><table>`;

            const featureInfoNode = layerWithFeatureInfo.featureInfo;

            if (layerWithFeatureInfo.featureInfo) {
              if (!featureInfoNode) content += '<tr><td class="featurePopupKey">No Data Available</td></tr>';

              if (layerWithFeatureInfo.source?.vectorTile) {
                Object.entries(featureInfoNode).map(([key, value]) => {
                  content += `<tr><td class="featurePopupKey">${key}:</td><td class="featurePopupValue">${value}</td></tr>`;

                  if (owningBlock.blockConfig.replaceNullWithNoData) content = content.replace('null', 'No Data');

                  // Make URL values clickable links.
                  if (isUrl(value as string)) {
                    content = content.replace(value as string, `<a href="${value}" target="_blank">${value}</a>`);
                  }
                });
              } else {
                for (let featureInfoProperty in featureInfoNode) {
                  const oneFeatureObject = featureInfoNode[featureInfoProperty];
                  content += `<tr><td class="featurePopupKey">${featureInfoProperty}:</td><td class="featurePopupValue">${roundValue(
                    oneFeatureObject.displayValue,
                    oneFeatureObject.significantDigits
                  )}</td></tr>`;

                  if (owningBlock.blockConfig.replaceNullWithNoData) content = content.replace('null', 'No Data');

                  // Make URL values clickable links.
                  if (isUrl(oneFeatureObject.displayValue as string)) {
                    content = content.replace(
                      oneFeatureObject.displayValue,
                      `<a href="${oneFeatureObject.displayValue}" target="_blank"><input type="button" value="View Story"></a>`
                    );
                  }

                  if (oneFeatureObject.displayName) content = content.replace(`>${featureInfoProperty}:<`, `>${oneFeatureObject.displayName}:<`);

                  if (layerWithFeatureInfo.additionalAttributes?.identifyToolValues?.[oneFeatureObject.displayValue]) {
                    content = content.replace(
                      `>${oneFeatureObject.displayValue.toString()}<`,
                      `>${layerWithFeatureInfo.additionalAttributes.identifyToolValues[oneFeatureObject.displayValue]}<`
                    );
                  }
                }
              }
            }
            // Close table and add a break for next layer's features
            content += `</table><hr class="hrPopup">`;
          }

          popup.show(event.coordinate, content);
        }
      });

      return toggle;
    };

    globalThis.App.OpenLayers.controls['identify'] = getIdentifyToggleButton;

    const extIdentifyTool = {
      extendedTool: extendedTool,
      cls: 'x-btn-left',
      iconCls: 'fa ' + 'fa-info-circle',
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      toggleGroup: extendedTool.toggleGroupId,
      id: extendedTool.extToolID,
      pressed: block.pressed,
      listeners: {
        toggle: function (button, pressed) {
          const me = this;
          // @ts-ignore
          if (!(me.pressed || Ext.ButtonToggleManager.getPressed(me.toggleGroup))) {
            me.toggle(true, true);
          }

          const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
          mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return extIdentifyTool;
  },
};
