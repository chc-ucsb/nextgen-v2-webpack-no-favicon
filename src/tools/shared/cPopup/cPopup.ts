/* This popup tool is just a button that pops up an
   alert.  The button icon, title, and message is
   configured within the template.
*/
export const cPopup = {
  options: {},
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extjsButton = {
      extendedTool: extendedTool,
      xtype: 'button',
      id: 'btn-popup',
      iconCls: block.iconCls,
      marginLeft: 10,
      marginBottom: 10,
      tooltip: block.tooltip,
      tooltipType: 'title',
      handler: function () {
        Ext.Msg.alert(block.title, block.popupMessage);
      },
    };
    return extjsButton;
  },
};
