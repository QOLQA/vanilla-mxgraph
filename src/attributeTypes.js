import mx from "./util";

export let overlay = new mx.mxCellOverlay(new mx.mxImage('../examples/editors/images/overlays/check.png', 16, 16), 'Overlay Tooltip');

export function configMenuCell(graph) {

  let mxCellRendererInstallCellOverlayListeners = mx.mxCellRenderer.prototype.installCellOverlayListeners;

  mx.mxCellRenderer.prototype.installCellOverlayListeners = function(state, overlay, shape) {
    mxCellRendererInstallCellOverlayListeners.apply(this, arguments);

    mx.mxEvent.addGestureListeners(shape.node,
      function(evt) {
        graph.fireMouseEvent(mx.mxEvent.MOUSE_DOWN, new mx.mxMouseEvent(evt, state));
      },
      function(evt) {
        graph.fireMouseEvent(mx.mxEvent.MOUSE_MOVE, new mx.mxMouseEvent(evt, state));
      },
      function(evt) {
        if (mx.mxClient.IS_QUIRKS) graph.fireMouseEvent(mx.mxEvent.MOUSE_UP, new mx.mxMouseEvent(evt, state));
      }
    );

    if (!mx.mxClient.IS_TOUCH) {
      mx.mxEvent.addListener(shape.node, 'mouseup', function(evt) {
        overlay.fireEvent(new mx.mxEventObject(mx.mxEvent.CLICK, 'event', evt, 'cell', state.cell));
      });
    }

    graph.popupMenuHandler.autoExpand = true;

    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      menu.addItem('String', null, modifyType(cell, 'String'));
      menu.addItem('Integer', null, modifyType(cell, 'Integer'));
      menu.addItem('Boolean', null, modifyType(cell, 'Boolean'));
      menu.addItem('Double', null, modifyType(cell, 'Double'));
      menu.addItem('Arrays', null, modifyType(cell, 'Arrays'));
      menu.addItem('Timestamp', null, modifyType(cell, 'Timestamp'));
      menu.addItem('Object', null, modifyType(cell, 'Object'));
      menu.addItem('Null', null, modifyType(cell, 'Null'));
      menu.addItem('Symbol', null, modifyType(cell, 'Symbol'));
      menu.addItem('Date', null, modifyType(cell, 'Date'));
    }
  }
}

function modifyType(cell, type) {
  cell.value.type = type;
}