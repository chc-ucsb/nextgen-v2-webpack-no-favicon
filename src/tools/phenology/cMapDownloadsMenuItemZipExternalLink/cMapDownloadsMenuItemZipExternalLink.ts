export const cMapDownloadsMenuItemZipExternalLink = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    var block = extendedTool.owningBlock.blockConfig;

    var menuItem = {
      extendedTool: extendedTool,
      text: block.text,
      tooltip: block.tooltip ? block.tooltip : '',
      tooltipType: 'title',
      handler: function () {
        var link = block.link;
        window.open(link, '_blank');
      },
    };

    return menuItem;
  },
};

export var toolName = 'cMapDownloadsMenuItemZipExternalLink';
export var tool = cMapDownloadsMenuItemZipExternalLink;
