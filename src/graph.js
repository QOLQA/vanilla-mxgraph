
import { configMenuCell } from "./attributeTypes";
import mxVertexToolHandler from "./contexticons";
import mxIconSet from "./hoverIcons";
import mx from "./util";

const container = document.querySelector('#container');

let examplesImagePath = '../../examples/images/';

// confiuracion de estilos para tablas
function configureTableStyle(graph) {
  let style = new Object();
  style[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_SWIMLANE;
  style[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_SWIMLANE;
  style[mx.mxConstants.STYLE_PERIMETER] = mx.mxPerimeter.RectanglePerimeter;
  style[mx.mxConstants.STYLE_ALIGN] = mx.mxConstants.ALIGN_CENTER;
  style[mx.mxConstants.STYLE_VERTICAL_ALIGN] = mx.mxConstants.ALIGN_TOP;
  style[mx.mxConstants.STYLE_GRADIENTCOLOR] = '#D19FFF';//abajo tittle
  style[mx.mxConstants.STYLE_FILLCOLOR] = '#C287FA'; //arriba tittle
  style[mx.mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#FFFFFF '; //casillero del atributo 
  style[mx.mxConstants.STYLE_STROKECOLOR] = '#FFFFFF'; // borde
  style[mx.mxConstants.STYLE_FONTCOLOR] = '#000000'; //fuente de letra T
  style[mx.mxConstants.STYLE_STROKEWIDTH] = '2'; //grosor de borde
  style[mx.mxConstants.STYLE_STARTSIZE] = '28'; //tamanio tittle --- NO TOCAR
  style[mx.mxConstants.STYLE_VERTICAL_ALIGN] = 'middle'; //posicion respecto a vertical
  style[mx.mxConstants.STYLE_FONTSIZE] = '12'; //tamnio de letra
  style[mx.mxConstants.STYLE_FONTSTYLE] = 2; //estilo: italico T
  //style[mx.mxConstants.STYLE_IMAGE] = 'images/icons48/table.png';
  // Looks better without opacity if shadow is enabled
  style[mx.mxConstants.STYLE_OPACITY] = '100';//opacidad de la tabla
  style[mx.mxConstants.STYLE_SHADOW] = 0;//shadow...para tridimensionalidad
  graph.getStylesheet().putCellStyle('table', style);

  style = new Object();
  style[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_RECTANGLE;
  style[mx.mxConstants.STYLE_PERIMETER] = mx.mxPerimeter.RectanglePerimeter;
  style[mx.mxConstants.STYLE_ALIGN] = mx.mxConstants.ALIGN_MIDDLE;
  style[mx.mxConstants.STYLE_VERTICAL_ALIGN] = mx.mxConstants.ALIGN_MIDDLE;
  style[mx.mxConstants.STYLE_FONTCOLOR] = '#000000'; //color de fuente A
  style[mx.mxConstants.STYLE_FONTSIZE] = '11'; //tamanio
  style[mx.mxConstants.STYLE_FONTSTYLE] = 0; //stilo
  /*style[mx.mxConstants.STYLE_SPACING_LEFT] = '8';
  style[mx.mxConstants.STYLE_IMAGE_WIDTH] = '100';
  style[mx.mxConstants.STYLE_IMAGE_HEIGHT] = '48';*/
  graph.getStylesheet().putDefaultVertexStyle(style);

  style = graph.stylesheet.getDefaultEdgeStyle();
  style[mx.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FAF7C6 ';
  style[mx.mxConstants.STYLE_STROKEWIDTH] = '2';
  style[mx.mxConstants.STYLE_ROUNDED] = true;
  style[mx.mxConstants.STYLE_EDGE] = mx.mxEdgeStyle.EntityRelation;
}

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

  // retornar un label
  graph.convertValueToString = function(cell) {
    if (cell.value != null && cell.value.name != null) {
      return cell.value.name;
    }
  }

  // viene de otra parte
  graph.createHandler = function(state) {
    if (state != null && this.isSwimlane(state.cell)) {
      return new mxVertexToolHandler(state);
    }

    return mx.mxGraph.prototype.createHandler.apply(this, arguments);
  }

  // menu para cambiar el tipo de atributo
  configMenuCell(graph);

  // labels
  graph.isHtmlLabel = function(cell) {
    return !this.isSwimlane(cell) && !this.model.isEdge(cell);
  }

  // retorna la etiqueta de la celda
  graph.getLabel = function(cell) {
    if (this.isHtmlLabel(cell)) {
      // cell.value este sera mi objeto
      return `${cell.value.name}:\t${cell.value.type}`;
    } else if (this.isSwimlane(cell)) {
      return cell.value.name;
    }
  }

  graph.model.valueForCellChanged = function(cell, value) {
    if (value.name != null) {
      return mx.mxGraphModel.prototype.valueForCellChanged.apply(this, arguments);
    } else {
      let old = cell.value.name;
      cell.value.name = value;
      return old;
    }
  }

  let iconTolerance = 20;

  // modify hover effect
  graph.addMouseListener({
    currentState: null,
    currentIconSet: null,
    mouseDown: function(sender, me) {
      if (this.currentState != null) {
        this.dragLeave(me.getEvent(), this.currentState);
        this.currentState = null;
      }
    },
    mouseMove: function(sender, me) {
      if (this.currentState != null && (me.getState() == this.currentState || me.getState() == null)) {
        let tol = iconTolerance;
        let tmp = new mx.mxRectangle(
          me.getGraphX() - tol, me.getGraphY() - tol, 2 * tol, 2 * tol
        );

        if (mx.mxUtils.intersects(tmp, this.currentState)) return;
      }

      // recuperamos la celda
      let tmp = graph.view.getState(me.getCell());

      if (graph.isMouseDown || (tmp != null && !graph.isHtmlLabel(tmp.cell))) {
        tmp = null;
      }

      if (tmp != this.currentState) {
        if (this.currentState != null) {
          this.dragLeave(me.getEvent(), this.currentState);
        }

        this.currentState = tmp;

        if (this.currentState != null) {
          this.dragEnter(me.getEvent(), this.currentState);
        }
      }
    },
    mouseUp: function(sender, me) { },
    dragEnter: function(evt, state) {
      if (this.currentIconSet == null) {
        this.currentIconSet = new mxIconSet(state);
      }
    },
    dragLeave: function(evt, state) {
      if (this.currentIconSet != null) {
        this.currentIconSet.destroy();
        this.currentIconSet = null;
      }
    }
  });

  configureTableStyle(graph);

  return { graph, editor };
}

export default createGraph;