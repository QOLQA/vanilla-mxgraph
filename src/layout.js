import mx from "./util";


function createLayout(editor) {
  editor.layoutSwimlanes = true;
  editor.createSwimlaneLayout = function() {
    let layout = new mx.mxStackLayout(this.graph, false);
    layout.fill = true;
    layout.resizeParent = true;

    layout.isVertexMovable = function(cell) {
      return true;
    }

    return layout;
  }
}

export default createLayout;