import { objPropExists } from '../helpers/object';
import { ExtJSPosition, addToolBarItems } from '../helpers/extjs';

export const cBlocks = {
  options: {
    events: ['resize'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    let obj: Record<string, any> = {
      extendedTool,
      items,
      cls: block.cssClass,
      style: block.style,
      menu,
      resizable: true,
      header: false,
      autoScroll: true,
      layout: 'autocontainer',
      collapsible: objPropExists(block, 'collapsible') ? block.collapsible : false,
      collapsed: objPropExists(block, 'collapsed') ? block.collapsed : false,
      width: block.width,
      height: block.height,
      // split : true,
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
        },
        resize() {
          this.extendedTool.owningBlock.fire('resize', this.extendedTool);
        },
      },
    };

    if (objPropExists(block, 'resizable')) obj.resizable = block.resizable;
    if (objPropExists(block, 'resizeHandles')) obj.resizeHandles = block.resizeHandles;

    if (objPropExists(block, 'title')) {
      obj.header = true;
      obj.title = block.title;
    } else {
      obj.header = false;
      obj.collapseMode = 'mini';
    }

    obj = addToolBarItems(block, obj, toolbar);

    return ExtJSPosition(obj, block);
  },
};
