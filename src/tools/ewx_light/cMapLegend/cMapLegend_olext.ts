import Legend from 'ol-ext/control/Legend';
import { LayerConfig } from '../../../@types';

export const cMapLegend_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const getLegendButton = ({ map }) => {
      const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');

      const getTurnedOnOverlays = () => {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(
          mapWindowBlock?.extendedTool?.layersConfigId ?? globalThis.App.Layers.getConfigInstanceId()
        );

        return globalThis.App.Layers.query(
          layersConfig,
          function (layer) {
            if (layer.type === 'layer' && (layer.display === true || layer.mask === true)) {
              return true;
            }
            return false;
          },
          ['boundaries']
        ).map((layer) => {
          const sourceWMSURL = layer.source.wms;
          const sourceGWCURL = layer.source.gwc;
          const isVisible = layer.display;

          const params = globalThis.App.OpenLayers.getWMSParams(layer, map);
          const options = {
            url: sourceGWCURL || sourceWMSURL,
            params,
            tileLoadFunction: globalThis.App.OpenLayers.imagePostFunction,
            visibility: layer.loadOnly ? false : isVisible,
          };

          return globalThis.App.OpenLayers.getSource('tile', options);
        });
      };

      const getLegendTitle = (layerConfig: LayerConfig) => {
        let legendTitle = 'Legend';
        if (layerConfig?.unit) legendTitle = `(${layerConfig.unit})`;
        else if (layerConfig?.unit === '') legendTitle = ' ';
        else if (layerConfig?.legend?.title) legendTitle = layerConfig.legend.title;

        return legendTitle;
      };

      // Convert the turned on overlays to OL source objects so getLegendUrl can be called
      const turnedOnOverlays = getTurnedOnOverlays();

      // Find the layer config
      if (typeof turnedOnOverlays?.[0].getParams === 'undefined') return;
      const layerConfig = globalThis.App.Layers._layers.find((_layer) => _layer.id === turnedOnOverlays[0].getParams().jsonLayerId);

      let legendTitle = getLegendTitle(layerConfig);

      let isCollapsed = false;
      if (block.pressed === false) isCollapsed = true;

      // Create the legend control
      const legend = new Legend({
        title: legendTitle,
        collapsed: isCollapsed,
      });

      // Function to call when the map resolution changes (zoom in/out)
      const update = (resolution, legendElement: HTMLLegendElement) => {
        const parent = legendElement.getElementsByTagName('ul').item(0);
        const legendTitle = parent.children.item(0) as HTMLElement;
        parent.innerHTML = '';
        parent.appendChild(legendTitle);

        const turnedOnOverlays = getTurnedOnOverlays().map((layer) => {
          if (typeof layer.getParams === 'undefined') return;
          const layerConfig = globalThis.App.Layers._layers.find((_layer) => _layer.id === layer.getParams().jsonLayerId);
          const params = {
            STYLE: layerConfig?.legend?.style ?? '',
            WIDTH: 20,
            HEIGHT: 17,
            LEGEND_OPTIONS: 'dx:10.0;dy:0.2;mx:0.2;my:0.2;fontStyle:normal;fontColor:000000;absoluteMargins:true;labelMargin:5;fontSize:13',
          };

          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const activeLayer = globalThis.App.Layers.query(
            layersConfig,
            function (layer) {
              if (layer.id === layerConfig.id) {
                return true;
              }
              return false;
            },
            ['boundaries']
          );

          const graphicUrl = layerConfig?.legend?.customImageURL ?? layer.getLegendUrl(resolution, params);
          // parent row to put an image and the text in two different columns
          const parentRow = document.createElement('div');
          parentRow.className = 'row';

          // div for the image.
          const imageDiv = document.createElement('div');
          const li = document.createElement('li');
          const img = document.createElement('img');
          imageDiv.appendChild(li);
          imageDiv.className = 'imageColumn';
          img.src = graphicUrl;
          li.appendChild(img);
          // append the image to the row.
          parentRow.appendChild(imageDiv);

          // dive for the image text
          const textDiv = document.createElement('div');
          textDiv.className = 'column';
          const text = document.createElement('h4');
          text.innerHTML = activeLayer[0].title;
          textDiv.appendChild(text);
          // append the text div to the row.
          parentRow.appendChild(textDiv);

          // append the whole row to the legend container.
          parent.appendChild(parentRow);

          legendTitle.innerText = getLegendTitle(layerConfig);

          return layer;
        });

        // Remove the title if there's no active layers.
        if (!turnedOnOverlays.length) {
          legendTitle.innerText = '';
        }
      };

      // Register Event Handlers
      // Call an update to the legend when the map resolution changes (zoom in/out)
      map.getView().on('change:resolution', function (event) {
        const resolution = event.target.getResolution();
        const legendElement = map
          .getControls()
          .getArray()
          .find((c) => '_imgElement' in c).element;

        update(resolution, legendElement);
      });

      // Register a callback for when the layer TOC is updated so
      // the legend is also updated.
      globalThis.App.EventHandler.registerCallbackForEvent(
        globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
        (_, map) => {
          const resolution = map.getView().getResolution();
          const legendElement = map
            .getControls()
            .getArray()
            .find((c) => '_imgElement' in c).element;

          update(resolution, legendElement);
        },
        map
      );

      return legend;
    };

    globalThis.App.OpenLayers.controls['legend'] = getLegendButton;

    return;
  },
};
