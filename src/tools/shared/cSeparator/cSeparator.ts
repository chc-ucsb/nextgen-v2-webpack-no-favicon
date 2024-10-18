export const cSeparator = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    return {
      xtype: 'tbseparator',
      width: block.width,
      height: block.height,
      style: block.style,
    };
  },
};
