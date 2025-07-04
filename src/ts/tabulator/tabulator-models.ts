import { CellComponent } from "tabulator-tables";
import { DataViewTableConfig } from "../models/data-view-table-config";

/** Tabulator Config
 * This is the format expected by the Tabulator library.
 */
export interface TabulatorConfig extends DataViewTableConfig {
  layout:
    | "fitDataStretch"
    | "fitData"
    | "fitColumns"
    | "fitDataFill"
    | "fitDataTable"
    | undefined;
  data: object[];
  columns: { title: string; field: string }[];
  pagination: boolean;
  paginationSize: number;
}

/** Tabulator Column Config
 * This is the format for the expected Tabulator Columns configuration options
 */
export interface TabulatorColumnConfig {
  title: string;
  field: string;
  tooltip?:
    | boolean
    | string
    | Node
    | ((e: Event, cell: CellComponent) => boolean | string | Node);
  headerHozAlign?: "right" | "left" | "center";
  hozAlign?: "right" | "left" | "center";
  width?: number | "automatic";
  formatter?: string;
  formatterParams?: object;
}
