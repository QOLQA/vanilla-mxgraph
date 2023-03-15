// import mxVertexToolHandler from "./contexticons";
import mxVertexToolHandler from "./contexticons";
import mx from "./util";

const container = document.querySelector('#container');

let examplesImagePath = '../../examples/images/';

function createGraph() {
  // definimos connction handler image
  mx.mxConnectionHandler.prototype.connectImage = new mx.mxImage(examplesImagePath + 'connector.gif', 16, 16);

  // sin el model
  let model = new mx.mxGraphModel();
  let graph = new mx.mxGraph(container, model);
  // let graph = new mx.mxGraph(container);
  // configuraciones
  graph.setConnectable(true);
  // Cada vez que arrastramos una conexion crea un modelo
  graph.connectionHandler.createTarget = true;

  // rubber band
  new mx.mxRubberband(graph);

  // conexion de vertices
  graph.createHandler = function(state) {
    // console.log('estado en graph', state);
    if (state != null && this.model.isVertex(state.cell)) {
      return new mxVertexToolHandler(state);
    }
    // if (this.model.isVertex(state.cell)) {
    //   let handler = new mxVertexToolHandler(state);
    // }

    return mx.mxGraph.prototype.createHandler.apply(this, arguments);
  }

  // resize parent container
  // graph.setResizeContainer(true);

  return graph;
}

export default createGraph;