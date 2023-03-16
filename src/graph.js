// import mxVertexToolHandler from "./contexticons";
import mxVertexToolHandler from "./contexticons";
import mx from "./util";

const container = document.querySelector('#container');

let examplesImagePath = '../../examples/images/';

function createGraph() {
  // mxswimlane modif
  mx.mxSwimlane.prototype.imageSize = 20;
  mx.mxSwimlane.prototype.imageDx = 16;
  mx.mxSwimlane.prototype.imageDy = 4;

  mx.mxSwimlane.prototype.getImageBounds = function(x, y, w, h) {
    return new mx.mxRectangle(
      x + this.imageDx, y + this.imageDy,
      this.imageSize, this.imageSize
    );
  }

  mx.mxConnectionHandler.prototype.connectImage = new mx.mxImage('/images/connector.gif', 16, 16);

  let editor = new mx.mxEditor();
  let graph = editor.graph;

  graph.setConnectable(true);
  graph.setCellsDisconnectable(false);
  graph.setCellsCloneable(false);
  graph.swimlaneNesting = false;
  graph.dropEnabled = true;
  graph.setAllowDanglingEdges(false);
  graph.connectionHandler.factoryMethod = null;

  graph.isCellResizable = function(cell) {
    return this.isSwimlane(cell);
  }

  graph.isCellMovable = function(cell) {
    return this.isSwimlane(cell);
  }

  graph.createHandler = function(state) {
    if (state != null && this.isSwimlane(state.cell)) {
      return new mxVertexToolHandler(state);
    }
    // if (state != null && this.model.isVertex(state.cell)) {
    //   return new mxVertexToolHandler(state);
    // }

    return mx.mxGraph.prototype.createHandler.apply(this, arguments);
  }

  return { graph, editor };
}

export default createGraph;