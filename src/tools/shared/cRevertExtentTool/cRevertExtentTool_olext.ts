import Button from 'ol-ext/control/Button';

export const cRevertExtentTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const getRevertExtentButton = ({ map }) => {
      map.on('moveend', function (evt) {
        const extent = globalThis.App.OpenLayers.getCurrentMapWindowExtent(map);
        const previousExtents = map.get('previousExtents');
        if (!previousExtents) {
          map.set('previousExtents', [extent]);
        } else {
          previousExtents.push(extent);
        }
      });

      return new Button({
        title: 'Previous Extent',
        html: '<i class="ms ms-zoom-previous"></i>',
        handleClick(): void {
          const map = this.getMap();
          const previousExtents = map.get('previousExtents');
          let previousExtent = previousExtents[0];

          if (previousExtents.length > 1) {
            previousExtents.pop();
            previousExtent = previousExtents.pop();
          }

          if (previousExtent) globalThis.App.OpenLayers.setCurrentMapWindowExtentFromExtentThatIsAlreadyInCorrectProjection(previousExtent, map);
        },
      });
    };

    globalThis.App.OpenLayers.controls['revert-extent'] = getRevertExtentButton;

    return;
  },
};
