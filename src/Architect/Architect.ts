import { Blueprint } from './Blueprint';
import { logger } from '../utils';
import { Block, BlockConfig } from './Block';
import { getRandomString } from '../helpers/string';

// Base interface for Block and Blueprint
export interface ArchitectBase {
  blockConfig: BlockConfig;
  type: string;
  events: {
    [key: string]: Array<any>;
  };
  itemDefinition: any;
  groupOwner: Blueprint | null;
  id: string;

  toolbarItems: Array<Blueprint>;
  menuItems: Array<Blueprint>;
  childItems: Array<Blueprint>;
  rendered: boolean;
  delayRender: boolean;
}

// Interface for Blueprint
export interface ArchitectBlueprint extends ArchitectBase {
  parent: Blueprint | null;
  uniqueId: string;
  requiredBlockBlueprints: Array<Blueprint>;
  relatedBlockBlueprints: Array<Blueprint>;
  groupBlockBlueprints: Array<Blueprint>;
  block: Block | null;
  copyId: string;
}

export class Architect {
  blockConfigs: Array<BlockConfig>;
  blueprintCopyCount: number;
  blueprintCopyList: Map<string, Array<Blueprint>>;
  blueprints: Array<Blueprint>;
  blueprintsLookup: Map<string, Array<Blueprint>>;
  isLoading: boolean;

  constructor() {
    this.blockConfigs = [];
    this.blueprints = [];
    this.blueprintCopyCount = 0;
    this.blueprintCopyList = new Map();
    this.blueprintsLookup = new Map();
    this.isLoading = true;
  }

  /**
   * Generate a random block ID
   * @return {string}
   */
  createBlockId(): string {
    return `block-${getRandomString(32, 36)}`;
  }

  /**
   * Apply unique IDs to all items in the template.json.
   * @param blockConfigs Array of {@link BlockConfig} objects
   * @returns {Array} of {@link BlockConfig} objects with IDs.
   */
  setBlockIds(blockConfigs: Array<BlockConfig>): Array<BlockConfig> {
    // Don't mutate original values
    const configs = blockConfigs.slice();

    configs.map((config) => {
      this.setBlockId(config);
    });

    return configs;
  }

  /**
   * Apply an unique ID to an item in the template.json
   * @param {BlockConfig} blockConfig
   * @returns {BlockConfig}
   */
  setBlockId(blockConfig: BlockConfig): BlockConfig {
    const config = blockConfig;
    config.id = this.createBlockId();

    if (config.toolbar) {
      config.toolbar.items = config.toolbar.items.map((i) => this.setBlockId(i));
    }
    if (config.items) {
      config.items = config.items.map((i) => this.setBlockId(i));
    }
    if (config.blocks) {
      config.blocks = config.blocks.map((i) => this.setBlockId(i));
    }
    return config;
  }

  /**
   * Sets references to all related blocks on
   * initial load after all blueprints are created.
   */
  setRelationships(blueprints: Array<Blueprint>): void {
    blueprints.map((blueprint) => {
      const { options } = blueprint.itemDefinition;
      if (options.requiredBlocks) {
        const { requiredBlocks } = options;
        for (let j = 0, { length } = requiredBlocks; j < length; j += 1) {
          const requiredBlock = requiredBlocks[j];

          const foundRequiredBlock = this.blueprintsLookup.get(requiredBlock);

          if (typeof foundRequiredBlock === 'undefined') {
            // Error -- Prints the name of the missing Block and the Block that is looking for it
            const message = `${blueprint.blockConfig.name} is looking for ${requiredBlock} but not finding it`;
            if (globalThis.App.Config.debugMode) {
              logger.error(message);
            }
          } else {
            blueprint.requiredBlockBlueprints = blueprint.requiredBlockBlueprints.concat(foundRequiredBlock);
          }
        }
      }

      if (blueprint.blockConfig.name) {
        const { name } = blueprint.blockConfig;
        const relatedBlueprints = this.blueprintsLookup.get(name) || [];
        for (let j = 0, { length } = relatedBlueprints; j < length; j += 1) {
          const relatedBlueprint = relatedBlueprints[j];
          if (relatedBlueprint.id !== blueprint.id) {
            blueprint.relatedBlockBlueprints.push(relatedBlueprint);
          }
        }
      }

      if (options.groupBy) {
        const groupOwnerName = options.groupBy;
        const groupOwner = (this.blueprintsLookup.get(groupOwnerName) || [])[0] || null;
        blueprint.groupOwner = groupOwner;
        groupOwner.groupBlockBlueprints.push(blueprint);
      }

      this.setRelationships(blueprint.toolbarItems);
      this.setRelationships(blueprint.menuItems);
      this.setRelationships(blueprint.childItems);
    }, this);
  }

  /**
   * Recursively builds an instance of Blueprint for
   * each item in the template.json on initial load.
   */
  buildBlueprints(blockConfigs: Array<BlockConfig>, parent: Blueprint | null = null, type = 'childItem'): Array<Blueprint> {
    const blueprints: Array<Blueprint> = [];
    for (const blockConfig of blockConfigs) {
      if (blockConfig.add !== false) {
        const blueprint = new Blueprint(blockConfig, parent, type, this);

        if (blockConfig.toolbar && blockConfig.toolbar.add !== false)
          blueprint.toolbarItems = this.buildBlueprints(blockConfig.toolbar.items, blueprint, 'toolbarItem');
        if (blockConfig.items) blueprint.menuItems = this.buildBlueprints(blockConfig.items, blueprint, 'menuItem');
        if (blockConfig.blocks) blueprint.childItems = this.buildBlueprints(blockConfig.blocks, blueprint, 'childItem');

        if (blockConfig.name) {
          const arr = this.blueprintsLookup.get(blockConfig.name) || [];
          arr.push(blueprint);

          this.blueprintsLookup.set(blockConfig.name, arr);
        }

        blueprints.push(blueprint);
      }
    }

    return blueprints;
  }

  /**
   * Since the performSetup method also calls performSetup on
   * grouped blueprints that are not direct children of that blueprint
   * when called recursively, and this method recurses through
   * all blueprints, we don't call performSetup with the recursive
   * parameter to avoid some of them being called twice.
   */
  performInitialSetup(blueprints: Array<Blueprint>): void {
    for (const blueprint of blueprints) {
      blueprint.performSetup();

      this.performInitialSetup(blueprint.toolbarItems);
      this.performInitialSetup(blueprint.menuItems);
      this.performInitialSetup(blueprint.childItems);
    }
  }

  /**
   * Recurse through all blueprints and create a block
   * for each one that does not have delayRender set
   * or "add" set to false in the template.json. This
   * only calls createBlock on the top level blueprints
   * as createBlock will create all child blocks recursively.
   */
  getBlocks(blueprints: Array<Blueprint>): Array<Block> {
    const blocks: Array<Block> = [];
    const items: Array<Block> = [];

    for (const blueprint of blueprints) {
      if (blueprint.blockConfig.add !== false) blocks.push(blueprint.createBlock());
    }

    for (const block of blocks) {
      items.push(block.render());
    }
    return items;
  }

  /**
   * Recurse through all blueprints to remove any
   * references to a block that has been removed.
   */
  removeReferencesToBlock(blueprints: Array<Blueprint>, blockId: string): void {
    for (const blueprint of blueprints) {
      const { block } = blueprint;
      if (block !== null) {
        const { blockReferences } = block;
        let index = -1;
        for (let j = 0, { length } = blockReferences; j < length; j += 1) {
          const blockReference = blockReferences[j];
          if (blockReference.id === blockId) {
            index = j;
            break;
          }
        }

        if (index >= 0) {
          block.blockReferences.splice(index, 1);
        }

        this.removeReferencesToBlock(blueprint.menuItems, blockId);
        this.removeReferencesToBlock(blueprint.toolbarItems, blockId);
        this.removeReferencesToBlock(blueprint.childItems, blockId);
      }
    }
  }
}
