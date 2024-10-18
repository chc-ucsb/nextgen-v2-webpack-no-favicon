import { ExtJSPosition } from '../../../helpers/extjs';
import { getPeriodsPerYear } from '../../../helpers/periodicity';

export const cChartTabPanel = {
  options: {
    destroyIfEmpty: true,
  },
  addChild: function (component, child) {
    component.add(child);
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      childIds: [],
      childUpdated: {
        periods: {},
        periodFormat: {},
      },
      updateChildren: function (updateType, chartContainer, triggerId) {
        let allChildrenUpdated = true;
        let noChildrenUpdated = true;
        for (var id in this.childUpdated[updateType]) {
          if (this.childUpdated[updateType][id] === false) {
            allChildrenUpdated = false;
          } else {
            noChildrenUpdated = false;
          }
        }

        if (noChildrenUpdated === true) {
          this.childUpdated[updateType][triggerId] = true;
          switch (updateType) {
            case 'periods':
              this.updateSelectedPeriods(triggerId);
              break;
            case 'periodFormat':
              this.updateSelectedPeriodFormat(triggerId);
              break;
          }
        } else if (allChildrenUpdated === true) {
          for (var id in this.childUpdated[updateType]) {
            this.childUpdated[updateType][id] = false;
          }
        }
      },
      updateSelectedPeriods: function (triggerId) {
        const children = this.component.items;
        const periodList = [];
        let colors = {};
        let periodFormat;
        children.each(function (child) {
          if (child.extendedTool.uniqueId === triggerId) {
            periodFormat = child.extendedTool.periodFormat;
            const selectedPeriods = child.extendedTool.selectedPeriods;
            const attributes = child.extendedTool.getAttributes();
            let { seasons, overlayId, boundaryId } = attributes;

            const dataKeys = child.extendedTool.data?.[boundaryId]?.[overlayId]?.data ?? null;
            const chartColors = globalThis.App.Charter.getChartColors({
              fullSeasons: dataKeys ? Object.keys(dataKeys) : seasons,
            });
            colors = { ...colors, ...chartColors };

            let i = 0;
            const len = seasons.length;
            for (; i < len; i += 1) {
              const season = seasons[i];
              let selected = true;
              if (selectedPeriods.indexOf(season) === -1) {
                selected = false;
              }
              periodList.push({
                period: season,
                selected: selected,
              });
            }
          }
        });
        children.each(function (child) {
          if (child.extendedTool.uniqueId !== triggerId) {
            this.childUpdated.periods[child.extendedTool.uniqueId] = true;

            // Only sync across charts that have the same periodFormat.
            if (child.extendedTool.periodFormat === periodFormat) {
              child.extendedTool.syncSelectedPeriods(periodList);
            }
          }
        }, this);
      },
      updateSelectedPeriodFormat: function (triggerId) {
        const children = this.component.items;
        let selectedPeriodFormat, selectedDataType;
        children.each(function (child) {
          if (child.extendedTool.uniqueId === triggerId) {
            selectedPeriodFormat = child.extendedTool.periodFormat;
            selectedDataType = child.extendedTool.selectedDataType;
          }
        });
        children.each(function (child) {
          if (child.extendedTool.uniqueId !== triggerId) {
            this.childUpdated.periodFormat[child.extendedTool.uniqueId] = true;
            child.extendedTool.setSelectedPeriodFormat(selectedPeriodFormat);
            console.log(child.extendedTool.owningBlock.rendered);
            if (child.extendedTool.owningBlock.rendered === true) {
              child.extendedTool.setSelectedDataType(selectedDataType);
            } else {
              child.extendedTool.selectedDataType = selectedDataType;
            }
          }
        }, this);
      },
    };

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    // Override for the TabPanel's TabBar so it scrolls faster on click
    // From https://forum.sencha.com/forum/showthread.php?301643-Increase-TabBar-scrolling-speed-within-TabPanel&p=1102306&viewfull=1#post1102306
    Ext.define('NextGen.TabBar.FasterScroll', {
      override: 'Ext.layout.container.boxOverflow.Scroller',
      scrollIncrement: 600,
    });

    const tabPanel = ExtJSPosition(
      {
        extendedTool: extendedTool,
        xtype: 'tabpanel',
        deferredRender: true,
        layout: 'card',
        autoRender: false,
        autoShow: false,
        defaults: {},
        closable: false,
        activeTab: 0,
        items: items,
        listeners: {
          afterrender: function () {
            this.extendedTool.component = this;
            this.extendedTool.owningBlock.component = this;
            this.extendedTool.owningBlock.rendered = true;

            const children = this.items;
            children.each(function (child) {
              this.childIds.push(child.extendedTool.uniqueId);
              this.childUpdated.periods[child.extendedTool.uniqueId] = false;
              this.childUpdated.periodFormat[child.extendedTool.uniqueId] = false;

              child.extendedTool.owningBlock.on(
                'periodschanged',
                function (callbackObj, postingObj, eventObj) {
                  const extendedTool = callbackObj;
                  const chartContainer = postingObj;
                  extendedTool.updateChildren('periods', chartContainer, chartContainer.uniqueId);
                },
                this
              );

              /*child.extendedTool.owningBlock.on('periodformatchanged', function(callbackObj, postingObj, eventObj) {
             var extendedTool = callbackObj;
             var chartContainer = postingObj;
             extendedTool.updateChildren('periodFormat', chartContainer, chartContainer.uniqueId);
             }, this);*/
            }, this.extendedTool);
          },
        },
      },
      block
    );

    return tabPanel;
  },
};
