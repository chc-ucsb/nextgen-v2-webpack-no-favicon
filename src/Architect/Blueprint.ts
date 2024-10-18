import { Block, BlockConfig } from './Block';
import { cBlocks } from './cBlocks';
import { Architect, ArchitectBlueprint } from './Architect';
import { getRandomString } from '../helpers/string';
import { convertPathToObjReference } from '../helpers/object';
import { isUndefined } from '../helpers/validation';

/**
 * An instance of this class is created on first load for every
 * item in the template.json. This handles creating Block instances,
 * determining which other blocks are referenced in cases such as
 * the chart container needing a reference to a specific map window,
 * and creating copies of itself as needed.
 */
export class Blueprint implements ArchitectBlueprint {
  blockConfig: BlockConfig;
  parent: Blueprint | null;
  type: string;
  events: Record<string, any>;
  id: string;
  uniqueId: string;
  requiredBlockBlueprints: Array<Blueprint>;
  relatedBlockBlueprints: Array<Blueprint>;
  groupBlockBlueprints: Array<Blueprint>;
  delayRender: boolean;
  groupOwner: Blueprint | null;
  block: Block | null;
  copyId: string;
  toolbarItems: Array<Blueprint>;
  menuItems: Array<Blueprint>;
  childItems: Array<Blueprint>;
  itemDefinition: any;
  rendered: boolean;
  architect: Architect;

  constructor(blockConfig: BlockConfig, parent: null | Blueprint, type: string, architect: Architect) {
    this.blockConfig = blockConfig;
    this.parent = parent;
    this.type = type;
    this.id = blockConfig.id;
    this.copyId = architect.blueprintCopyCount.toString();
    this.architect = architect;
    this.uniqueId = `block-blueprint-${getRandomString(32, 36)}`;
    this.requiredBlockBlueprints = [];
    this.relatedBlockBlueprints = [];
    this.groupBlockBlueprints = [];
    this.delayRender = false;
    this.groupOwner = null;
    this.block = null;
    this.toolbarItems = [];
    this.menuItems = [];
    this.childItems = [];
    this.events = {
      blueprintcopied: [],
      blockcreated: [],
    };
    this.rendered = false;

    if (this.blockConfig.name) {
      this.itemDefinition = convertPathToObjReference(globalThis.App.Tools, this.blockConfig.name);
    } else {
      this.itemDefinition = cBlocks;
    }

    // Set options to empty object if not specified so we can add default options to it.
    if (!this.itemDefinition?.options) {
      this.itemDefinition.options = {};
    }

    // delayRender mean to not create a block until asked to.
    if (this.itemDefinition?.options?.delayRender) {
      this.delayRender = this.itemDefinition.options.delayRender;
    }

    // Set the default createExtendedTool method to just reference the owning block.
    if (!this.itemDefinition.createExtendedTool) {
      // this.itemDefinition.createExtendedTool = (owningBlock: Blueprint) => owningBlock
      this.itemDefinition.createExtendedTool = (owningBlock: Block): { owningBlock: Block } => {
        return {
          owningBlock,
        };
      };
    }

    // Track all blueprint copies so that references to other blocks can be determined.
    const bpCopy = this.architect.blueprintCopyList.get(this.copyId);
    if (bpCopy) {
      bpCopy.push(this);
      this.architect.blueprintCopyList.set(this.copyId, bpCopy);
    } else {
      this.architect.blueprintCopyList.set(this.copyId, [this]);
    }
  }

  /**
   * Stop delaying the component from rendering
   */
  undelayRender(): void {
    if (this.rendered !== true) {
      this.delayRender = false;
      if (this.parent !== null) {
        this.parent.undelayRender();
      }
    }
  }

  /**
   * If asked to create a block but the parent blueprint has not
   * created a block yet, then call createParentBlock first.
   */
  createParentBlock(): null | void {
    if (this.parent === null) {
      return null;
    }

    this.parent.createBlock();

    // if (this.parent !== null) this.parent.createBlock();
    //
    // return null;
  }

  /**
   * Add the child `Block` to the parent `Block` as either a toolbar, menu, or child item.
   * @param child A `Block` object to assign to a parent `Block` object.
   * @param parent The parent `Block` object to assign the child to.
   */
  addChildToParent(child: Block, parent: Block): void {
    switch (child.type) {
      case 'toolbarItem':
        parent.toolbarItems.push(child);
        break;
      case 'menuItem':
        parent.menuItems.push(child);
        break;
      case 'childItem':
        parent.childItems.push(child);
        break;
      default:
        break;
    }
  }

  /**
   * Create and return an instance of `Block` for this `Blueprint`.
   */
  createBlock(): Block {
    // If a block is already created for this blueprint, then
    // we assume we want a new block so we have to
    // create a copy of this blueprint. This is used in
    // cases such as multiple map windows or chart windows.
    if (this.block !== null) {
      const copy = this.copy(this.parent);
      return copy.createBlock();
    }

    // If it has a parent and the parent block is not created
    // yet, delegate creating the block to the parent.
    if (this.parent !== null && this.parent.block === null) {
      // const block = this.parent.createBlock()
      this.parent.createBlock();
      // return block
      return this.block;
    }

    let parent = null;
    if (this.parent !== null && this.parent.block !== null) {
      parent = this.parent.block;
    }

    this.block = new Block(this, parent);

    // Recurse down the heirarchy and create blocks for all children.
    const { toolbarItems, menuItems, childItems, requiredBlockBlueprints } = this;

    for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
      const toolbarItem = toolbarItems[i];
      if (toolbarItem.delayRender === false) {
        toolbarItem.createBlock();
      }
    }

    for (let i = 0, len = menuItems.length; i < len; i += 1) {
      const menuItem = menuItems[i];
      if (menuItem.delayRender === false) {
        menuItem.createBlock();
      }
    }

    for (let i = 0, len = childItems.length; i < len; i += 1) {
      const childItem = childItems[i];
      if (childItem.delayRender === false) {
        childItem.createBlock();
      }
    }

    // Get references to other blocks.
    requiredBlockBlueprints.map((requiredBlock) => {
      if (!isUndefined(requiredBlock)) {
        // If the block has not yet been created for the blueprint,
        // store the reference after the blockcreated event is fired.
        if (requiredBlock.block !== null) {
          this.block.blockReferences.push(requiredBlock.block);
        } else {
          requiredBlock.on(
            'blockcreated',
            function (block: Block, referencedBlock: Block) {
              block.blockReferences.push(referencedBlock);
            },
            this.block
          );
        }
      }
    });

    // Add the block to the parent block.
    if (this.parent !== null) this.addChildToParent(this.block, this.parent.block);
    this.fire('blockcreated', this.block);
    return this.block;
  }

  /**
   * Sometimes a tool needs to execute some code before a `Block`
   * is created. In these cases, you can define an init method in
   * the item definition.
   * This is also called for `Blueprint` copies.
   */
  performSetup(recursive?: boolean): void {
    if (this.itemDefinition.init) {
      this.itemDefinition.init(this);
    }

    if (recursive) {
      const { toolbarItems, menuItems, childItems, groupBlockBlueprints } = this;

      for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
        const toolbarItem = toolbarItems[i];
        toolbarItem.performSetup(recursive);
      }

      for (let i = 0, len = menuItems.length; i < len; i += 1) {
        const menuItem = menuItems[i];
        menuItem.performSetup(recursive);
      }

      for (let i = 0, len = childItems.length; i < len; i += 1) {
        const childItem = childItems[i];
        childItem.performSetup(recursive);
      }

      // If this blueprint is a group owner, call all performSetup methods
      // on blueprints that are grouped by this blueprint.
      for (let i = 0, len = groupBlockBlueprints.length; i < len; i += 1) {
        const groupBlock = groupBlockBlueprints[i];
        const foundItem = this.findChildById(groupBlock.id);
        if (foundItem === null) {
          groupBlock.performSetup(recursive);
        }
      }
    }
  }

  /**
   * Performs a complete copy of this `Blueprint` class.
   * This is used in cases like multiple map windows.
   * @param parent The `Blueprint` to create a copy of.
   */
  copy(parent?: Blueprint | null): Blueprint {
    let copy;
    // When a blueprint is copied, other blueprints may need to
    // be copied as well so we store a unique copy id in order
    // for other blueprints to reference the new copy.
    this.architect.blueprintCopyCount += 1;

    // Local recursive function for copying this blueprint and all related blueprints.
    const performCopy = function (blueprint: Blueprint, _parent: Blueprint | null): Blueprint {
      const _copy = new Blueprint(blueprint.blockConfig, _parent, blueprint.type, blueprint.architect);

      // Add all referenced blueprints to the copy's references.
      // At this time they will reference the same blueprints because
      // not all new copies are created yet so it will need to be
      // updated to the new copies later.
      const { relatedBlockBlueprints, requiredBlockBlueprints, toolbarItems, menuItems, childItems, groupBlockBlueprints } = blueprint;

      for (let i = 0, len = relatedBlockBlueprints.length; i < len; i += 1) {
        const relatedBlock = relatedBlockBlueprints[i];
        _copy.relatedBlockBlueprints.push(relatedBlock);
      }

      for (let i = 0, len = requiredBlockBlueprints.length; i < len; i += 1) {
        const requiredBlock = requiredBlockBlueprints[i];
        _copy.requiredBlockBlueprints.push(requiredBlock);
      }

      for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
        const toolbarItem = toolbarItems[i];
        _copy.toolbarItems.push(performCopy(toolbarItem, _copy));
      }

      for (let i = 0, len = menuItems.length; i < len; i += 1) {
        const menuItem = menuItems[i];
        _copy.menuItems.push(performCopy(menuItem, _copy));
      }

      for (let i = 0, len = childItems.length; i < len; i += 1) {
        const childItem = childItems[i];
        _copy.childItems.push(performCopy(childItem, _copy));
      }

      for (let i = 0, len = groupBlockBlueprints.length; i < len; i += 1) {
        const groupBlock = groupBlockBlueprints[i];
        const foundBlock = _copy.findChildById(groupBlock.id);
        // All blueprints that are children of this blueprint are automatically copied
        // recursively but some blocks such as the chart window are not children
        // but still need to be copied.
        if (foundBlock === null) {
          const groupBlockCopy = performCopy(groupBlock, groupBlock.parent);
          groupBlockCopy.groupOwner = _copy;
          _copy.groupBlockBlueprints.push(groupBlockCopy);
        } else {
          groupBlock.groupOwner = _copy;
          _copy.groupBlockBlueprints.push(groupBlock);
        }
      }

      blueprint.fire('blueprintcopied', _copy);
      return _copy;
    };

    if (isUndefined(parent)) {
      copy = performCopy(this, this.parent);
    } else {
      copy = performCopy(this, parent);
    }

    // const copy = performCopy(this, parent)
    // Change referenced blueprints to the new copies that were made.
    copy.updateRelationships(copy);
    // Perform the initial setup for this blueprint and all child blueprints.
    copy.performSetup(true);

    return copy;
  }

  /**
   * Updates references to other `Blueprint`s.
   * When a `Blueprint` is a copy of an existing `Blueprint`, not all related blueprints are
   * copied at that time.
   * In order to update the references with the new copies, this is called after all copies are created.
   */
  updateRelationships(groupOwner: Blueprint): void {
    const { toolbarItems, menuItems, childItems, requiredBlockBlueprints, relatedBlockBlueprints } = this;
    let { groupBlockBlueprints } = groupOwner;
    const copyId = this.copyId.toString();
    const blueprintCopyList = this.architect.blueprintCopyList.get(copyId);

    // If this blueprint is a copy, update the relationships
    // so they are referencing the same as the previous blueprint.
    if (typeof blueprintCopyList !== 'undefined') {
      for (let i = 0, len = relatedBlockBlueprints.length; i < len; i += 1) {
        const relatedBlock = relatedBlockBlueprints[i];
        for (let j = 0, { length } = blueprintCopyList; j < length; j += 1) {
          const blueprintCopy = blueprintCopyList[j];
          if (blueprintCopy.id === relatedBlock.id) {
            this.relatedBlockBlueprints[i] = blueprintCopy;
          }
        }
      }

      for (let i = 0, len = requiredBlockBlueprints.length; i < len; i += 1) {
        const requiredBlock = requiredBlockBlueprints[i];
        for (let j = 0, { length } = blueprintCopyList; j < length; j += 1) {
          const blueprintCopy = blueprintCopyList[j];
          if (blueprintCopy.id === requiredBlock.id) {
            this.requiredBlockBlueprints[i] = blueprintCopy;
          }
        }
      }
    }

    for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
      const toolbarItem = toolbarItems[i];
      toolbarItem.updateRelationships(groupOwner);
    }

    for (let i = 0, len = menuItems.length; i < len; i += 1) {
      const menuItem = menuItems[i];
      menuItem.updateRelationships(groupOwner);
    }

    for (let i = 0, len = childItems.length; i < len; i += 1) {
      const childItem = childItems[i];
      childItem.updateRelationships(groupOwner);
    }

    // Update all blueprints grouped by this blueprint.
    groupBlockBlueprints = this.groupBlockBlueprints;
    for (let i = 0, len = groupBlockBlueprints.length; i < len; i += 1) {
      const groupBlock = groupBlockBlueprints[i];
      // In the case of the charts, they can be docked inside
      // the map window or be it's own floating window. If it's
      // docked, it will be updated as a child item.
      if (this.findChildById(groupBlock.id) === null) {
        groupBlock.updateRelationships(groupOwner);
      }
    }
  }

  /**
   * Recursively finds a child `Blueprint` based on its identifier.
   */
  findChildById(id: string): Blueprint | null {
    const { toolbarItems, menuItems, childItems } = this;

    for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
      const toolbarItem = toolbarItems[i];
      if (toolbarItem.id === id) {
        return toolbarItem;
      }
      const foundChild = toolbarItem.findChildById(id);
      if (foundChild !== null) return foundChild;
    }

    for (let i = 0, len = menuItems.length; i < len; i += 1) {
      const menuItem = menuItems[i];
      if (menuItem.id === id) {
        return menuItem;
      }
      const foundChild = menuItem.findChildById(id);
      if (foundChild !== null) return foundChild;
    }

    for (let i = 0, len = childItems.length; i < len; i += 1) {
      const childItem = childItems[i];
      if (childItem.id === id) {
        return childItem;
      }
      const foundChild = childItem.findChildById(id);
      if (foundChild !== null) return foundChild;
    }

    return null;
  }

  /**
   * One blueprint must always exist for each item in the template.json.
   * If this is the initial blueprint, reset it to how it was at initial load
   * time before creating a block. If it's a copy, remove it.
   */
  removeBlueprint(): void {
    let siblings = [];
    let indexInParent = 0;
    let isCopyOfBlueprint = this.blockConfig.add === false;
    if (this.parent !== null) {
      switch (this.type) {
        case 'toolbarItem':
          siblings = this.parent.toolbarItems;
          break;
        case 'menuItem':
          siblings = this.parent.menuItems;
          break;
        case 'childItem':
          siblings = this.parent.childItems;
          break;
        default:
          break;
      }
    } else {
      siblings = this.architect.blueprints;
    }

    // If this is a copy of another blueprint, remove it from the parent blueprint.
    for (let i = 0, len = siblings.length; i < len; i += 1) {
      const sibling = siblings[i];
      if (sibling.id === this.id) {
        if (sibling.uniqueId === this.uniqueId) {
          indexInParent = i;
        } else {
          isCopyOfBlueprint = true;
        }
      }
    }

    if (isCopyOfBlueprint === true) {
      siblings.splice(indexInParent, 1);
    }
  }

  /**
   * Since a single blueprint must always exist for each item in
   * the template.json, if trying to remove the last blueprint that
   * exists, we instead reset it to the state it was in at initial
   * load before a block was created.
   */
  reset(): void {
    const { childItems, toolbarItems, menuItems } = this;
    this.uniqueId = `block-blueprint-${getRandomString(32, 36)}`;

    if (this.itemDefinition.options.delayRender === true) {
      this.delayRender = true;
    }

    for (let i = 0, len = childItems.length; i < len; i += 1) {
      const childItem = childItems[i];
      childItem.reset();
    }

    for (let i = 0, len = toolbarItems.length; i < len; i += 1) {
      const toolbarItem = toolbarItems[i];
      toolbarItem.reset();
    }

    for (let i = 0, len = menuItems.length; i < len; i += 1) {
      const menuItem = menuItems[i];
      menuItem.reset();
    }
  }

  on(eventName: string, callback: Function, callbackObj: any): void {
    if (this.events[eventName]) {
      this.events[eventName].push({
        callbackObj,
        callback,
      });
    }
  }

  fire(eventName: string, postingObj: any): void {
    if (this.events[eventName]) {
      const events = this.events[eventName];
      for (let i = 0, len = events.length; i < len; i += 1) {
        const event = events[i];
        event.callback(event.callbackObj, postingObj);
      }
    }
  }

  getReferencedBlueprint(blockName: string): Blueprint | null {
    const blueprints = this.requiredBlockBlueprints;
    for (let i = 0, len = blueprints.length; i < len; i += 1) {
      const blueprint = blueprints[i];
      if (blueprint.blockConfig.name === blockName) {
        return blueprint;
      }
    }
    return null;
  }
}
