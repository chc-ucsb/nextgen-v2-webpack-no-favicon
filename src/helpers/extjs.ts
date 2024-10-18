import { Dict, IBlock } from '../@types';
import { Block, BlockConfig, Blueprint, ToolbarConfig } from '../Architect';

/**
 * Convenience function for getting the correct ExtJS region
 * config from the template.json.
 * Note that this only works for the top level components
 * even though it's supposed to work for all.
 */
export const ExtJSPosition = (configObj: Record<string, any>, block: IBlock): Record<string, any> => {
  let config = configObj;
  switch (block.block) {
    case 'top':
      config.region = 'north';
      break;
    case 'bottom':
      config.region = 'south';
      break;
    case 'left':
      config.region = 'west';
      break;
    case 'right':
      config.region = 'east';
      break;
    case 'center':
      config.region = 'center';
      break;
    case 'relative':
      if (config.xtype === 'panel') {
        config.floating = true;
      } else {
        config.ghost = false;
        config.constrain = true;
        if (block.x) config.x = block.x;
        if (block.y) config.y = block.y;
        config = Ext.create('Ext.Window', config);
        config.show();
        config.doLayout();
      }

      break;
    default:
      config.region = 'north';
      break;
  }

  return config;
};

/**
 * Convenience function called inside a getComponent method
 * to add any toolbar items present in the template.json.
 */
export const addToolBarItems = (
  block: BlockConfig,
  panel: Dict<any>,
  toolbarExtItems: Array<any>,
  toolbarConfig?: ToolbarConfig
): Ext.panel.IPanel => {
  let config = toolbarConfig;

  // If no toolbar is configured or "add" is set to false, just return the component.
  if (!block.toolbar || block.toolbar.add === false) return panel;

  // If the toolbar has no custom config set, set some defaults.
  if (!config) {
    config = {};
    if (block.toolbar.overflowMenu === true) {
      config.enableOverflow = true;
    }

    if (typeof block.toolbar.style !== 'undefined') {
      config.style = block.toolbar.style;
    }
  }

  const tb = Ext.create('Ext.toolbar.Toolbar', config);

  for (const toolbarItem of toolbarExtItems) {
    if (typeof toolbarItem === 'object') {
      toolbarItem.owningToolbar = tb;
    }
    tb.add(toolbarItem);
  }

  switch (block.toolbar.position) {
    case 'top':
      panel.tbar = tb;
      break;
    case 'bottom':
      panel.bbar = tb;
      break;
    case 'left':
      panel.lbar = tb;
      break;
    case 'right':
      panel.rbar = tb;
      break;
    default:
      panel.tbar = tb;
      break;
  }
  return panel;
};

/**
 * Gets all blocks with the specified name.
 * Note that in some cases like with the chart container, the template.json
 * may have it configured multiple times but only one or the other is
 * used at a given time. This will only return the blocks currently being used.
 */
export const getBlocksByName = (name: string, blocks?: Array<Block>, matches: Array<Block> = []): Array<Block> => {
  if (typeof blocks === 'undefined') {
    blocks = [];
    for (const blueprint of globalThis.App._blueprints) {
      if (blueprint.block !== null) {
        blocks.push(blueprint.block);
      }
    }
  }

  if (typeof matches === 'undefined') matches = [];

  for (const block of blocks) {
    if (block.blockConfig.name === name && block.rendered === true) {
      matches.push(block);
    }
    matches = getBlocksByName(name, block.childItems, matches);
    matches = getBlocksByName(name, block.toolbarItems, matches);
    matches = getBlocksByName(name, block.menuItems, matches);
  }
  return matches;
};

/**
 * Gets all instances of BlockBlueprint with the given name.
 */
export const getBlueprintsByName = (name: string, blueprints?: Array<Blueprint>, matches: Array<Blueprint> = []): Array<Blueprint> => {
  if (typeof blueprints === 'undefined') {
    blueprints = globalThis.App._blueprints;
  }

  if (typeof matches === 'undefined') matches = [];

  for (const blueprint of blueprints) {
    if (blueprint.blockConfig.name === name) {
      matches.push(blueprint);
    }
    matches = getBlueprintsByName(name, blueprint.childItems, matches);
    matches = getBlueprintsByName(name, blueprint.toolbarItems, matches);
    matches = getBlueprintsByName(name, blueprint.menuItems, matches);
  }
  return matches;
};
