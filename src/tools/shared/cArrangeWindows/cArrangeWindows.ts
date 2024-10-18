import { getBlocksByName } from '../../../helpers/extjs';

export const cArrangeWindows = {
  options: {
    events: ['collapse', 'expand'],
    requiredBlocks: ['cMapWindow'],
  },
  mapWindowContainer: null,
  arrangeInProgress: false,
  mapWindowResizedCallback: function (eventObject, callbackObject, postingObject) {
    const blueprint = callbackObject;
    if (blueprint.itemDefinition.arrangeInProgress === false && blueprint.block !== null && blueprint.block.rendered === true) {
      const arrangeWindowsTool = blueprint.block.extendedTool;
      arrangeWindowsTool.setButtonsInactive();
    }
  },
  init: function (blueprint) {
    if (blueprint.itemDefinition.mapWindowContainer === null) {
      const requiredBlockBlueprints = blueprint.requiredBlockBlueprints;
      let mapWindowBlueprint;
      let i = 0;
      const len = requiredBlockBlueprints.length;
      for (; i < len; i += 1) {
        const requiredBlock = requiredBlockBlueprints[i];
        if (requiredBlock.blockConfig.name === 'cMapWindow') {
          mapWindowBlueprint = requiredBlock;
          break;
        }
      }

      if (mapWindowBlueprint.blockConfig.block !== 'relative') {
        console.error('Arrange Windows Tool only operates on relative positioned cMapWindow blocks. Arrange Windows Tool will not be added.');
        blueprint.blockConfig.add = false;
        blueprint.removeBlueprint();
        return;
      }

      globalThis.App.EventHandler.registerCallbackForEvent(
        globalThis.App.EventHandler.types.EVENT_MAPWINDOW_RESIZED,
        // this.mapWindowResizedCallback,
        blueprint.itemDefinition.mapWindowResizedCallback,
        blueprint
      );

      if (mapWindowBlueprint.block !== null) {
        blueprint.itemDefinition.mapWindowContainer = mapWindowBlueprint.block.parent;
      } else {
        mapWindowBlueprint.on(
          'blockcreated',
          function (callbackObj, postingObj) {
            const blueprint = callbackObj;
            const mapWindowBlock = postingObj;

            const mapWindowContainer = mapWindowBlock.parent;
            blueprint.itemDefinition.mapWindowContainer = mapWindowContainer;

            Ext.TaskManager.start({
              scope: blueprint,
              interval: 100,
              run: function () {
                const container = this.itemDefinition.mapWindowContainer.component;
                if (container) {
                  const arrangeWindowsTool = this;
                  container.on('resize', function () {
                    const activeButton = arrangeWindowsTool.block.extendedTool.getActiveButton();
                    if (activeButton !== null) {
                      setTimeout(
                        function (button) {
                          button.sizeWindow();
                        },
                        1,
                        activeButton
                      );
                    }
                  });

                  return false;
                } else {
                  return true;
                }
              },
            });
          },
          blueprint
        );
      }
    }
  },

  mapWindowCreatedCallback: function (eventObject, callbackObject, postingObject) {
    const arrangeWindowsTool = callbackObject;
    arrangeWindowsTool.openMapWindows += 1;
    arrangeWindowsTool.update();
  },

  mapWindowDestroyedCallback: function (eventObject, callbackObject, postingObject) {
    const arrangeWindowsTool = callbackObject;
    arrangeWindowsTool.openMapWindows -= 1;
    arrangeWindowsTool.update();
  },

  update: function (eventObject, callbackObject, postingObject) {
    const arrangeWindowsTool = callbackObject;
    arrangeWindowsTool.update();
  },

  regionChange: function (eventObject, callbackObject, postingObject) {
    const arrangeWindowsTool = callbackObject;
    arrangeWindowsTool.openMapWindows = 1;
    arrangeWindowsTool.regionChange();
  },

  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      openMapWindows: 1,
      fullDimensions: {},
      justCreated: true,
      update: function () {
        const extTool = this.component;

        this.setButtons();
        extTool.updateLayout();
      },
      regionChange: function () {
        for (let id in this.buttons) {
          this.buttons[id].toggle(true);
          break;
        }
      },
      getWindowHeight: function (dimensions, rowspan, numRows) {
        return Math.floor((dimensions.height / numRows) * rowspan);
      },
      getWindowWidth: function (dimensions, colspan, numCols) {
        return Math.floor((dimensions.width / numCols) * colspan);
      },
      getWindowX: function (dimensions, section, numSections) {
        return Math.floor(dimensions.x + (dimensions.width / numSections) * section);
      },
      getWindowY: function (dimensions, section, numSections) {
        return Math.floor(dimensions.y + (dimensions.height / numSections) * section);
      },
      getDimensions: function (table, containerDimensions) {
        const dimensions = [],
          windowTable = [];
        var rowLen: number;

        for (var row = 0, rowLen: number = table.rows.length; row < rowLen; row += 1) {
          windowTable[row] = [];
        }

        for (var row = 0, rowLen = windowTable.length; row < rowLen; row += 1) {
          var tr = table.rows[row];
          for (var cell = 0, cellLen = tr.cells.length; cell < cellLen; cell += 1) {
            var td = tr.cells[cell],
              colspan = td.colspan,
              rowspan = td.rowspan;

            windowTable[row].push(td);
            while (colspan > 1) {
              windowTable[row].push('empty');
              colspan -= 1;
            }
          }
        }

        for (var row = 0, rowLen = windowTable.length; row < rowLen; row += 1) {
          var tr = table.rows[row];
          for (var cell = 0, cellLen = tr.cells.length; cell < cellLen; cell += 1) {
            var td = tr.cells[cell],
              colspan = td.colspan,
              rowspan = td.rowspan,
              column = cell;

            while (rowspan > 1) {
              while (colspan > 0) {
                if (typeof windowTable[row + rowspan - 1] !== 'undefined') windowTable[row + rowspan - 1].splice(column, 0, 'empty');
                column += 1;
                colspan -= 1;
              }
              column = cell;
              colspan = td.colspan;
              rowspan -= 1;
            }
          }
        }

        for (var row = 0, rowLen = windowTable.length; row < rowLen; row += 1) {
          var tr = windowTable[row];

          for (var cell = 0, cellLen = tr.length; cell < cellLen; cell += 1) {
            var td = tr[cell];
            if (td === 'empty') continue;

            dimensions.push({
              height: this.getWindowHeight(containerDimensions, td.rowspan, rowLen),
              width: this.getWindowWidth(containerDimensions, td.colspan, cellLen),
              x: this.getWindowX(containerDimensions, cell, cellLen),
              y: this.getWindowY(containerDimensions, row, rowLen),
            });
          }
        }

        return dimensions;
      },
      getContainerDimensions: function () {
        const mapWindowContainer = this.owningBlock.itemDefinition.mapWindowContainer.component;

        return {
          x: mapWindowContainer.getX(),
          y: mapWindowContainer.getY(),
          width: mapWindowContainer.getWidth(),
          height: mapWindowContainer.getHeight(),
        };
      },
      setButtons: function () {
        let btnId = 0;

        this.component.removeAll();
        this.buttons = {};

        if (this.openMapWindows >= 10) {
          const container = Ext.create('Ext.container.Container', {
            html: "<p>'Arrange Windows Tool' arranges number of windows up to 9</p>",
          });
          this.component.items.add(container);
        }

        const tables = this.getTables(this.openMapWindows);
        if (tables === null) return;

        let i = 0;
        const len = tables.length;
        for (; i < len; i += 1) {
          const table = tables[i];
          const btnDimensions = this.getDimensions(table, { width: 42, height: 42, x: 7, y: 7 });
          let // Dimensions for the button
            html = '<div class="snap-windows-btn-wrapper">';

          let j = 0;
          const length = btnDimensions.length;
          for (; j < length; j += 1) {
            const dimensions = btnDimensions[j],
              width = dimensions.width,
              height = dimensions.height,
              x = dimensions.x,
              y = dimensions.y;

            html +=
              '<div class="snap-windows-btn" style="width: ' + width + 'px; height: ' + height + 'px; left: ' + x + 'px; top: ' + y + 'px;"></div>';
          }

          html += '</div>';

          const button = Ext.create('Ext.button.Button', {
            arrangeWindowTool: this,
            id: 'snap-btn-' + btnId,
            width: 62,
            height: 62,
            windowConfigs: table,
            style: {
              backgroundColor: '#FFFFFF',
              backgroundImage: 'none',
            },
            border: false,
            html: html,
            sizeWindow: function () {
              const windowDimensions = this.arrangeWindowTool.getDimensions(this.windowConfigs, this.arrangeWindowTool.getContainerDimensions()),
                mapWindows = getBlocksByName('cMapWindow');
              this.arrangeWindowTool.owningBlock.itemDefinition.arrangeInProgress = true;

              let j = 0;
              const length = mapWindows.length;
              for (; j < length; j += 1) {
                const mapWindow = Ext.getCmp(mapWindows[j].component.getId()),
                  dimensions = windowDimensions[j];

                mapWindow.setHeight(dimensions.height);
                mapWindow.setWidth(dimensions.width);
                mapWindow.setX(dimensions.x);
                mapWindow.setY(dimensions.y);
                mapWindow.extendedTool.owningBlock.fire('move', mapWindow.extendedTool);
              }
              this.arrangeWindowTool.owningBlock.itemDefinition.arrangeInProgress = false;
            },
            setAsActive: function () {
              const buttons = this.arrangeWindowTool.buttons;
              for (let btnId in buttons) {
                const button = buttons[btnId];
                if (btnId !== this.id) {
                  if (button.hasCls('snap-button-active')) button.removeCls('snap-button-active');
                } else {
                  if (!button.hasCls('snap-button-active')) button.addCls('snap-button-active');
                }
              }

              this.sizeWindow();
            },
            handler: function () {
              this.setAsActive();
            },
            listeners: {
              toggle: function () {
                if (this.pressed) {
                  this.setAsActive();
                }
              },
            },
          });

          this.buttons['snap-btn-' + btnId] = button;
          btnId += 1;

          this.component.add(button);
        }
      },
      setButtonsInactive: function () {
        for (let btnId in this.buttons) {
          const button = this.buttons[btnId];
          if (button.hasCls('snap-button-active')) button.removeCls('snap-button-active');
        }
      },
      getActiveButton: function () {
        for (let btnId in this.buttons) {
          const button = this.buttons[btnId];
          if (button.hasCls('snap-button-active')) return button;
        }
        return null;
      },
      getTables: function (numWindows) {
        const tables = this.owningBlock.itemDefinition.tableDefinitions;

        if (numWindows === 0 || numWindows > tables.length) return null;
        return tables[numWindows - 1];
      },
    };

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_CREATED,
      extendedTool.owningBlock.itemDefinition.mapWindowCreatedCallback,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_DESTROYED,
      extendedTool.owningBlock.itemDefinition.mapWindowDestroyedCallback,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_REGION_CHANGED,
      extendedTool.owningBlock.itemDefinition.regionChange,
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;
    const title = block.title;

    const extTool = Ext.create('Ext.Panel', {
      extendedTool: extendedTool,
      id: 'arrangeWindowsTool',
      title: title,
      width: '100%',
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      collapseFirst: false,
      closable: false,
      layout: 'hbox',
      componentCls: 'panel-border',
      grow: true,
      autoSize: true,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      hidden: block?.hideFromDom === true,
      tools: [
        {
          type:'help',
          tooltip: 'Get Help',
          callback: function(panel, tool, event) {
            Ext.Msg.show({
              title:'Arrange Windows Tool',
              msg: 'This tool is used to arrange the layout of one or more map windows. Map windows will rearrange according to the option selected from the "Arrange Windows Tool" panel',
              buttons: Ext.Msg.CANCEL,
              icon: Ext.Msg.QUESTION
            });
          }
        },
      ],
      listeners: {
        collapse: function () {
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('expand')).el.dom.title = 'Expand';
          this.extendedTool.owningBlock.fire('collapse', this.extendedTool);
        },

        expand: function () {
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('collapse')).el.dom.title = 'Collapse';
          this.extendedTool.owningBlock.fire('expand', this.extendedTool);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.update();

          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });

          const firstBtn = this.extendedTool.buttons['snap-btn-0'];

          if (typeof firstBtn !== 'undefined') {
            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');

            setTimeout(
              function (button, mapWindowExtendedTool) {
                button.sizeWindow();
                mapWindowExtendedTool.setRegionExtent();
              },
              10,
              firstBtn,
              mapWindowBlock.extendedTool
            );

            firstBtn.addCls('snap-button-active');
          }
        },
      },
    });

    return extTool;
  },
  tableDefinitions: [
    [
      // One window
      {
        rows: [
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Two windows
      {
        rows: [
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Three windows
      {
        rows: [
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
              {
                colspan: 1,
                rowspan: 1,
              },
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                colspan: 2,
                rowspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                colspan: 1,
                rowspan: 2,
              },
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                colspan: 1,
                rowspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Four windows
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 3,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 3,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Five windows
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 2,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 2,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 2,
              },
              {
                rowspan: 1,
                colspan: 2,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 2,
                colspan: 2,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Six windows
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 3,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 2,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 2,
                colspan: 2,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Seven windows
      {
        rows: [
          {
            cells: [
              {
                rowspan: 2,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 2,
              },
              {
                rowspan: 1,
                colspan: 2,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 2,
              },
              {
                rowspan: 1,
                colspan: 2,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Eight windows
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
    ],
    [
      // Nine windows
      {
        rows: [
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
          {
            cells: [
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
              {
                rowspan: 1,
                colspan: 1,
              },
            ],
          },
        ],
      },
    ],
  ],
};
