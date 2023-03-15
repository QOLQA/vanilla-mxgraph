import mx from "./util";


function createLayout(graph) {
  let layout = new mx.mxStackLayout(graph, true);
  layout.border = graph.border;

  let layoutMgr = new mx.mxLayoutManager(graph);
  layoutMgr.getLayout = function(cell) {
    if (!cell.collapsed) {
      if (cell.parent != graph.model.root) {
        layout.resizeParent = true;
        layout.horizontal = false;
        layout.spacing = 2;
      } else {
        layout.resizeParent = true;
        layout.horizontal = true;
        layout.spacing = 15;
      }

      return layout;
    }

    return null;
  }
}

export default createLayout;