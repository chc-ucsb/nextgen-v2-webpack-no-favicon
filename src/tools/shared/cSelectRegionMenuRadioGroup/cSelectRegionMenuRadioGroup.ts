export const cSelectRegionMenuRadioGroup = {
  options: {
    events: ['select'],
    requiredBlocks: ['cStateTool', 'cRegionSelectorMenu', 'cResetQuery', 'cSelectRegionTool'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const component = {
      extendedTool: extendedTool,
      xtype: 'radiogroup',
      layout: {
        type: 'vbox',
        align: 'left',
      },
      vertical: true,
      hidden: true,
      columns: 1,
      items: items[0],
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          const radioBlock = this.extendedTool.owningBlock.childItems[0]; // Only one radio buttons block can
          // be a child of radio group.
          radioBlock.extendedTool.radioGroup = this.extendedTool;
          radioBlock.on(
            'select',
            function (callbackObj, postingObj) {
              const extendedTool = callbackObj;
              const radioButtonsTool = postingObj;
              extendedTool.selectedValue = radioButtonsTool.selectedValue;
              extendedTool.owningBlock.fire('select', extendedTool);
            },
            this.extendedTool
          );

          const stateBlock = this.extendedTool.owningBlock.getReferencedBlock('cStateTool');
          if (stateBlock !== null) {
            stateBlock.on(
              'select',
              function (callbackObj, postingObj) {
                const extendedTool = callbackObj;
                extendedTool.component.show();
              },
              this.extendedTool
            );
          }
        },
      },
    };

    const containingMenu = extendedTool.owningBlock.getReferencedBlock('cRegionSelectorMenu');
    if (containingMenu !== null) {
      containingMenu.on(
        'menushow',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          const statesBlock = extendedTool.owningBlock.getReferencedBlock('cStateTool');
          if (statesBlock !== null && statesBlock.rendered === true) {
            if (statesBlock.extendedTool.stateValue !== null) {
              extendedTool.component.show();
            }
          }
        },
        extendedTool
      );
    }

    const resetQueryBlock = extendedTool.owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          if (extendedTool.owningBlock.rendered === false) return;
          const radioBlock = extendedTool.owningBlock.childItems[0];
          const radioButtons = radioBlock.component;
          let i = 0;
          const len = radioButtons.length;
          for (; i < len; i += 1) {
            const radioButton = radioButtons[i];
            radioButton.setValue(false);
          }

          extendedTool.component.hide();
        },
        extendedTool
      );
    }

    const selectRegionBlock = extendedTool.owningBlock.getReferencedBlock('cSelectRegionTool');
    if (selectRegionBlock !== null) {
      selectRegionBlock.on(
        'aoiSelected',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          if (extendedTool.owningBlock.rendered === true) extendedTool.component.show();
        },
        extendedTool
      );
    }

    return component;
  },
};
