import type { TableCellComponent } from "../datatable/DataTable.vue.d";

export interface MultiRowAttribute {
  class?: string | string[];
  value?: string;
  bodyComponent?: TableCellComponent;
}