//import mxVertexToolHandler from "./contexticons";
import createGraph from "./graph";
import createLayout from "./layout";
import mx from "./util";

let container = document.querySelector('#container');

const editorImagesPath = '../../examples/editors/images/';

if (!mx.mxClient.isBrowserSupported()) {
  mx.mxUtils.error('Browser is not supported!', 200, false);
} else {
  // crea div para toolbar
  let tbContainer = document.createElement('div');
  tbContainer.style.position = 'absolute';
  tbContainer.style.overflow = 'hidden';
  tbContainer.style.padding = '2px';
  tbContainer.style.left = '0px';
  tbContainer.style.top = '26px';
  tbContainer.style.width = '24px';
  tbContainer.style.bottom = '0px';

  // agregar toolbar a la modelo
  document.body.appendChild(tbContainer);

  // Crea un toolbar sin procesamiento de eventos
  let toolbar = new mx.mxToolbar(tbContainer);
  toolbar.enabled = false;

  container.style.position = 'absolute';
  container.style.overflow = 'hidden';
  container.style.left = '24px';
  container.style.top = '26px';
  container.style.right = '0px';
  container.style.bottom = '0px';
  //container.style.background = 'url("editors/images/grid.gif")';
  container.style.background = `url(${editorImagesPath}grid.gif)`;

  if (mx.mxClient.IS_QUIRKS) {
    document.body.style.overflow = 'hidden';
    new mx.mxDivResizer(tbContainer);
    new mx.mxDivResizer(container);
  }

  let {graph, editor} = createGraph();

  editor.setGraphContainer(container);

  createLayout(graph);
  // graph.createHandler = function(state) {
  //   if (state != null && this.model.isVertex(state.cell)) {
  //     return new mxVertexToolHandler(state);
  //   }

  //   return mx.mxGraph.prototype.createHandler.apply(this, arguments);
  // };

  // empareja DNd dentro del grafo
  mx.mxDragSource.prototype.getDropTarget = function(graph, x, y) {
    let cell = graph.getCellAt(x, y);

    if (!graph.isValidDropTarget(cell)) {
      cell = null;
    }

    return null;
  };

  // parar la edicion al dar enter o tecla escape
  let keyHandler = new mx.mxKeyHandler(graph);
  let rubberband = new mx.mxRubberband(graph);

  let addVertex = function(icon, w, h, style) {
    let vertex = new mx.mxCell(null, new mx.mxGeometry(0, 0, w, h), style);
    vertex.setVertex(true);

    addToolbarItem(graph, toolbar, vertex, icon);
  };

  // solo agregar la primera opcion
  addVertex(editorImagesPath + 'swimlane.gif', 120, 160, 'shape=swimlane;startSize=20;');
}


function addToolbarItem(graph, toolbar, prototype, image) {
  let funct = function(graph, evt, cell) {
    graph.stopEditing(false);

    let pt = graph.getPointForEvent(evt);
    let vertex = graph.getModel().cloneCell(prototype);
    vertex.geometry.x = pt.x;
    vertex.geometry.y = pt.y;

    graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
  };

  // crea la imagen que es usada para el arrastre
  let img = toolbar.addMode(null, image, funct);
  mx.mxUtils.makeDraggable(img, graph, funct);
}