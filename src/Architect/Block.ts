import { Blueprint } from './Blueprint';
import { ArchitectBase } from './Architect';
import { ExtentType } from '../@types';
import { getRandomString } from '../helpers/string';
import { objPropExists } from '../helpers/object';

export interface ShowByDefault {
  amountSelected: number;
  others: Array<string>;
}

export interface BlockConfig {
  init?: Function;
  block: string;
  name?: string;
  id: string;
  import?: string;
  label?: string;
  add?: boolean;
  type?: string;
  format?: string;
  text?: string;
  tooltip?: string;
  width?: number | string;
  height?: number | string;
  cssClass?: string;
  bodyStyle?: string;
  // style?:       string;
  collapsible?: boolean;
  content?: string;
  link?: string;
  // toolbar?:     BlockConfig;
  toolbar?: ToolbarConfig;
  items: Array<BlockConfig>;
  title?: string;
  blocks?: Array<BlockConfig>;
  collapsed?: boolean;
  legendPosition?: string;
  dockedState?: string;
  showByDefault?: ShowByDefault;
  saveSelection?: boolean;
  pressed?: boolean;
  pickerType?: string;
  /*
   * position?:    string;
   * overflowMenu?:boolean;
   */
  icon?: string;
  url?: string;
  showOnFirstLoad?: boolean;
  popupTitle?: string;
  popupHeight?: number;
  popupWidth?: number;
  popupBody?: string;
  destroyIfEmpty?: boolean;
  max_extent?: ExtentType;
  projection?: string;
  center?: ExtentType;
  interactions?: Array<string>;
  options?: {
    events?: Array<string>;
    delayRender?: boolean;
    requiredBlocks?: Array<string>;
    groupBy?: string;
    block?: any;
  };
  createExtendedTool?: Function;
}

export interface ToolbarConfig {
  add?: boolean;
  overflowMenu?: boolean;
  style?: Record<string, any>;
  position?: 'top' | 'bottom' | 'left' | 'right';
  items?: Array<BlockConfig>;
  enableOverflow?: boolean;
}

// Interface for Block
export interface ArchitectBlock extends ArchitectBase {
  parent: Block | null;
  blueprint: Blueprint;
  extendedTool: any;
  blockReferences: Array<Block>;
}

export class Block implements ArchitectBlock {
  blockConfig: BlockConfig;
  parent: Block | null;
  type: string;
  events: Record<string, any>;
  /**
   * The itemDefinition property is a reference to the tool's source code.
   */
  itemDefinition: any;
  /**
   * An example of a group would be having one or more chart blocks
   * created per open map window. This is needed so that each chart
   * knows which map window it belongs to.
   */
  groupOwner: Blueprint | null;
  id: string;
  blueprint: Blueprint;
  extendedTool: any;
  blockReferences: Array<Block>;
  toolbarItems: Array<any>;
  menuItems: Array<any>;
  childItems: Array<any>;
  rendered: boolean;
  delayRender: boolean;
  component: any;

  constructor(blueprint: Blueprint, parent?: Block | null) {
    this.blockConfig = blueprint.blockConfig;
    this.parent = parent || null;
    this.type = blueprint.type;
    this.itemDefinition = blueprint.itemDefinition;
    this.groupOwner = blueprint.groupOwner;
    this.id = `block-${getRandomString(32, 36)}`;
    this.blueprint = blueprint;
    this.extendedTool = null;
    this.blockReferences = [];
    this.toolbarItems = [];
    this.menuItems = [];
    this.childItems = [];
    this.events = {
      remove: [],
    };
    this.rendered = false;
    this.delayRender = false;

    if (this.blockConfig.toolbar) {
      this.events.overflowmenushow = [];
    }

    // Add any events defined in the tool's item definition (source code)
    const { options } = this.itemDefinition;
    if (options.events) {
      const { events } = options;
      for (let i = 0, len = events.length; i < len; i += 1) {
        this.events[events[i]] = [];
      }
    }
  }

  /**
   * Registers a callback to an event.
   */
  on(eventName: string, callback: Function, callbackObj: any, id: number | null = null): void {
    if (this.events[eventName]) {
      this.events[eventName].push({
        callbackObj,
        callback,
        id,
        enabled: true,
      });
    }
  }

  /**
   * Fires an event and calls all registered callbacks.
   */
  fire(eventName: string, postingObj: any, originalEvent?: string): void {
    if (this.events[eventName]) {
      const events = this.events[eventName];
      for (let i = 0, len = events.length; i < len; i += 1) {
        const event = events[i];
        if (event.enabled) event.callback(event.callbackObj, postingObj, originalEvent);
      }
    }
  }

  createExtendedTool(): void {
    this.extendedTool = this.itemDefinition.createExtendedTool(this);
  }

  /**
   * Recurses through all blocks and renders each one that is not already rendered.
   * It first creates the extended tool for each one, then calls getComponent and adds
   * whatever is returned to it's parent container.
   */
  render(): any {
    const renderedChildItems = [];
    const renderedRelativeChildItems = [];
    const renderedToolbarItems = [];
    const renderedMenuItems = [];
    let items;
    let toolbar;
    let menu;

    if (this.rendered === false) {
      this.createExtendedTool();
    }

    // Render all child blocks to the body if this block is a container type.
    if (this.blockConfig.blocks) {
      for (let i = 0, len = this.childItems.length; i < len; i += 1) {
        const item = this.childItems[i];
        /*
         * Skip rendering blocks that are already rendered or have delayRender set to true.
         * delayRender is used for cases like the chart windows in which a block is created
         * for each open map window but is not rendered until clicking the map.
         */
        if (item.delayRender !== true && item.rendered === false) {
          if (item.blockConfig?.block === 'relative') {
            renderedRelativeChildItems.push(item.render());
          } else {
            renderedChildItems.push(item.render());
          }
        }
      }

      items = renderedChildItems;
    }

    // Render all toolbar item blocks if this block is a container type and has a toolbar.
    if (this.blockConfig.toolbar) {
      for (let i = 0, len = this.toolbarItems.length; i < len; i += 1) {
        const item = this.toolbarItems[i];
        if (item.delayRender !== true && item.rendered === false) {
          renderedToolbarItems.push(item.render());
        }
      }

      toolbar = renderedToolbarItems;
    }

    // Render all menu item blocks if this block is a menu type.
    if (this.blockConfig.items) {
      for (let i = 0, len = this.menuItems.length; i < len; i += 1) {
        const item = this.menuItems[i];
        if (item.delayRender !== true && item.rendered === false) {
          renderedMenuItems.push(item.render());
        }
      }

      menu = renderedMenuItems;
    }

    /*
     * If this component is already rendered, add new children to the existing component.
     * If it is not rendered, call the getComponent method from the item definition.
     */
    if (this.rendered === true) {
      // Make sure new child items are being rendered.
      if (renderedChildItems.length > 0) {
        /*
         * Some Extjs components have to be added to its parent differently so
         * we support adding an addChild method to the item definition for these cases.
         */
        if (objPropExists(this.itemDefinition, 'addChild')) {
          this.itemDefinition.addChild(this.component, renderedChildItems);
        } else {
          this.component.add(renderedChildItems);
        }

        // Extjs often doesn't handle adding child items well. Calling doLayout seems to make it work.
        this.component.doLayout();
      }
    } else {
      return this.itemDefinition.getComponent(this.extendedTool, items, toolbar, menu);
    }
  }
  /*
   * component(component: any, renderedChildItems: any[]) {
   *   throw new Error("Method not implemented.");
   * }
   */

  /**
   * When delayRender is true, in order to render a tool on demand, the render
   * method must be called on a block that is already rendered. This may be
   * multiple levels up in the component heirarchy.
   */
  getClosestRenderedParent(): Block | null {
    if (this.rendered === false) {
      if (this.parent !== null) {
        return this.parent.getClosestRenderedParent();
      }
    } else {
      return this;
    }
    return null;
  }

  /**
   * Recursively find a child item by block name.
   */
  find(blockName: string): string | null {
    for (let i = 0, len = this.childItems.length; i < len; i += 1) {
      const item = this.childItems[i];
      if (item.block.name === blockName) return item;
      const childItem = item.find(blockName);
      if (childItem !== null) return childItem;
    }
    return null;
  }

  addChild(childBlock: Block): Block {
    this.childItems.push(childBlock);
    const component = childBlock.render();
    this.component.items.add(component);
    return this;
  }

  /**
   * To render a block on demand, delayed rendering needs to be disabled.
   * This not only needs to disable it for the current block but also any
   * parent blocks that are delayed.
   */
  undelayRender(): Block {
    if (this.rendered !== true) {
      this.delayRender = false;
      if (this.parent !== null) {
        this.parent.undelayRender();
      }
    }

    return this;
  }

  /**
   * Un renders a block from it's parent. In some cases,
   * parent blocks need to be unrendered as well.
   */
  unRender(itemLevel = 0): void {
    // If this is the block that unRender was initially called from.
    if (itemLevel === 0) {
      /*
       * Some blocks such as the container for chart tabs need to be removed
       * if all the tabs have been closed.
       * let parentsNeedUnRendered = this.parentNeedsUnRendered()
       * if (parentsNeedUnRendered) {
       */
      if (this.parentNeedsUnRendered()) {
        this.parent?.unRender(itemLevel);
      } else {
        // First remove the component from the container.
        if (this.parent !== null && this.parent.component !== null) {
          this.parent.component.remove(this.component);
        }

        /*
         * Sometimes removing the component from the container is enough
         * but sometimes it's not so we call the destroy method.
         * Sometimes removing the component also sets this.component to null
         * so check for that first.
         */
        if (this.component !== null) {
          this.component.destroy();
        }
      }
    }

    const { childItems, toolbarItems, menuItems } = this;

    for (let i = 0, len = childItems.length; i < len; i += 1) {
      const childItem = childItems[i];
      childItem.unRender(itemLevel + 1);
    }

    for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
      const toolbarItem = toolbarItems[i];
      toolbarItem.unRender(itemLevel + 1);
    }

    for (let i = 0, len = menuItems.length; i < len; i += 1) {
      const menuItem = menuItems[i];
      menuItem.unRender(itemLevel + 1);
    }

    this.extendedTool = null;
    this.component = null;
    this.rendered = false;

    this.events = {}; // Remove all events associated with this block.
  }

  /**
   * Checks to see if the parent components need to be unrendered
   * in response to a child block being unrendered.
   */
  parentNeedsUnRendered(): boolean {
    let parentNeedsUnRendered = false;
    if (this.parent !== null) {
      const items = this.parent[`${this.type}s` as keyof Block];
      /*
       * Check if no children are present or if a single child is
       * present and is the child being unrendered.
       */
      if (items.length === 0 || (items.length === 1 && items[0].id === this.id)) {
        // destroyIfEmpty can either be set in the template.json or in the tool's item definition.
        if (this.parent.blockConfig.destroyIfEmpty === true || this.parent.itemDefinition.options.destroyIfEmpty === true) {
          parentNeedsUnRendered = true;
        } else {
          parentNeedsUnRendered = this.parent.parentNeedsUnRendered();
        }
      }
    }

    return parentNeedsUnRendered;
  }

  /**
   * Removes all registered event listeners to other blocks as it's being unrendered.
   * Care must be taken to not remove event listeners before the removed event is fired.
   * Since multiple instances of this block could have an event listener on the
   * same block, we use the block's id to ensure we only remove events for this block.
   */
  removeEventListeners(): void {
    const { blockReferences } = this;
    for (let i = 0, len = blockReferences.length; i < len; i += 1) {
      const { events } = blockReferences[i];
      for (const eventName of Object.keys(events)) {
        const listeners = events[eventName];
        for (let j = 0, { length } = listeners; j < length; j += 1) {
          const listener = listeners[j];
          if (listener.id === this.id) {
            listener.enabled = false;
            listener.callback = null;
            listener.callbackObj = null;
          }
        }
      }
    }
  }

  /**
   * This function completely removes a `Block` and its associated `Blueprint`
   * when simply unrendering is not enough.
   * This also recurses down the heirarchy and removes all of its children.
   */
  remove(itemLevel = 0): void {
    this.removeEventListeners();

    if (itemLevel === 0) {
      /*
       * If the parent container needs removed as well, delegate
       * the removal to the parent. That will cause it to recurse
       * back down to this component so the remove method will
       * be called again. Otherwise, start removing from this block.
       */
      if (this.parentNeedsRemoved()) {
        this.parent?.remove(itemLevel);
      } else {
        if (this.rendered === true) {
          this.unRender();
        }
        let containingArray = [];

        /*
         * If this block is not a top level block, remove it from its parent block.
         * Otherwise, remove it from the list of top level blocks.
         */
        if (this.parent !== null) {
          containingArray = this.parent[`${this.type}s` as keyof Block];
        } else {
          const topBlueprints = this.blueprint.architect.blueprints;
          for (let i = 0, len = topBlueprints.length; i < len; i += 1) {
            const topBlueprint = topBlueprints[i];
            if (topBlueprint.block !== null) {
              containingArray.push(topBlueprint.block);
            }
          }
        }

        let index = -1;
        for (let i = 0, len = containingArray.length; i < len; i += 1) {
          const item = containingArray[i];
          if (item.id === this.id) {
            index = i;
            break;
          }
        }

        if (index !== -1 && this.parent) this.parent[`${this.type}s` as keyof Block].splice(index, 1);
      }
    }

    // Recursively remove all children.
    const { childItems } = this;
    const { toolbarItems } = this;
    const { menuItems } = this;

    for (let i = 0, len = childItems.length; i < len; i += 1) {
      const childItem = childItems[i];
      childItem.remove(itemLevel + 1);
    }

    for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
      const toolbarItem = toolbarItems[i];
      toolbarItem.remove(itemLevel + 1);
    }

    for (let i = 0, len = menuItems.length; i < len; i += 1) {
      const menuItem = menuItems[i];
      menuItem.remove(itemLevel + 1);
    }

    this.blueprint.block = null;
    this.blueprint.reset();

    // Recurse through all other blocks and remove any references to this block.
    this.blueprint.architect.removeReferencesToBlock(this.blueprint.architect.blueprints, this.id);

    this.fire('remove', this);
  }

  /**
   * Recurse up the heirarchy to determine if a parent
   * needs removed in response to this `Block` being removed.
   * Returns a boolean value.
   */
  parentNeedsRemoved(): boolean {
    let parentNeedsRemoved = false;
    if (this.parent !== null) {
      const items = this.parent[`${this.type}s` as keyof Block];
      if (items.length === 0 || (items.length === 1 && items[0].id === this.id)) {
        if (this.parent.blockConfig.destroyIfEmpty === true || this.parent.itemDefinition.options.destroyIfEmpty === true) {
          parentNeedsRemoved = true;
        } else {
          parentNeedsRemoved = this.parent.parentNeedsRemoved();
        }
      }
    }

    return parentNeedsRemoved;
  }

  /**
   * In some cases (like with the identify tool when we expand it), we
   * also want to expand the container.
   * Since the tool may or may not be placed in a collapsible container, we do this recursively.
   */
  expandParents(): void {
    if (this.parent !== null) {
      if (this.parent.rendered === true) {
        if (this.parent.component.getCollapsed() !== false) {
          this.parent.component.expand();
        }
        this.parent.expandParents();
      }
    }
  }

  /**
   * Collapse the parent `Block` container.
   */
  collapseParents(): void {
    if (this.parent !== null) {
      if (this.parent.rendered === true) {
        if (this.parent.component.collapsible === true) {
          if (this.parent.component.getCollapsed() === false) {
            this.parent.component.collapse();
          }
        } else {
          this.parent.collapseParents();
        }
      }
    }
  }

  /**
   * This gets a `Block` referenced in the item definition.
   * This will only ever return a single `Block`, as referencing
   * multiple blocks is not supported.
   * To get all blocks with a particular name, use `Architect#getBlocksByName`.
   */
  getReferencedBlock(blockName: string): Block | null {
    const { blockReferences } = this;

    for (let i = 0, len = blockReferences.length; i < len; i += 1) {
      const block = blockReferences[i];
      if (block.blockConfig.name === blockName) {
        return block;
      }
    }

    // if (blockReferences.length) {
    //   return blockReferences.find(ref => ref.blockConfig.name === blockName) || null
    // }

    if (globalThis.App.Config.debugMode) {
      console.error(`Failed finding referencedBlock ${blockName}`);
    }

    return null;
  }
}
