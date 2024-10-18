// Core dependencies
import './src/core/core-dependencies';

// @ts-ignore
// Project-specific configuration
import config from './configs/PROJECT_NAME';
import { NextGenViewer } from './src/NextGenViewer';

Ext.onReady(async () => {
  Ext.setGlyphFontFamily('FontAwesome');

  /**
   * This ExtJS override fixes the issue of when a component is masked and is inside a floating container --
   * if the floating container moves, the mask does not move with it.
   * We are assuming the devs of ExtJS are not going to fix this issue since it was asked in 2012 but never addressed.
   * See https://www.sencha.com/forum/showthread.php?252691-4-2-0-beta-GridPanel-in-Window-loading-mask-doesn-t-move-with-Window
   * This fix was found here https://stackoverflow.com/questions/21438425/loading-mask-not-tied-to-component-breaking-on-move-of-parent-x-y
   */
  Ext.override(Ext.LoadMask, {
    sizeMask() {
      const me = this;
      let target;

      if (me.rendered && (me.isVisible() || me.getMaskEl().isVisible())) {
        me.center();

        target = me.getMaskTarget();
        me.getMaskEl().show().setSize(target.getSize()).alignTo(target, 'tl-tl');
      }
    },
  });

  new NextGenViewer(config);
});
