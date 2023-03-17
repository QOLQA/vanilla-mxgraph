import { Column, Table } from "./userobjects";
import mx from "./util";

let tableObject = new Table('TABLENAME');
let table = new mx.mxCell(tableObject, new mx.mxGeometry(0, 0, 200, 28), 'table');

table.setVertex(true);

// logica de sidebar icon

let columnObject = new Column('COLUMNAME');
let column = new mx.mxCell(columnObject, new mx.mxGeometry(0, 0, 0, 26));

column.setVertex(true);
column.setConnectable(false);