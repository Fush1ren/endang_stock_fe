import type { Component } from "vue";
import type { Icons } from "../icons/Icons.vue";
import type { MenuItem } from "primevue/menuitem";

export type ChildGroup = {
    groupHeader: string;
    groupItems: Data[];
};
  
export type Data = Record<string, any> & {
    children?: ChildGroup[];
    hasChildren?: boolean;
};

export type QueryParams = Partial<Record<string, any>>;

export type FetchResponse<T = Data> = {
    message: string;
    data: {
      data: T[];
      totalRecords: number;
    };
};

export interface ColumnMultiRowPreset {
  type: 'multirow';
  fieldAttributes?: (data: any) => MultiRowAttribute[];
}

export type ColumnPreset = ColumnMultiRowPreset;

export interface TableColumn {
    header: string;
    field: string;
    sortable?: boolean;
    bodyTemplate?: (data: any, index: number) => string | undefined;
    preset?: ColumnPreset;
    bodyClass?: string | string[] | ((data?: any) => string | string[]);
}

export type DataTableProps = {
    tableName?: string;
    lazy?: boolean;
    columns: TableColumn[];
    useOptions?: boolean;
    fetchFunction?: (params: QueryParams) => Promise<FetchResponse | undefined>;
    selectedData?: Data[];
    usePaginator?: boolean;
    options?: MenuItem[];
    includeCheckDisabledRows?: boolean;
    data?: Data[];
    disableAllRows?: boolean;
    dataKey?: string;
    defaultQueryParams?: Readonly<Record<string, any>>;
    search?: string;
    filters?: DataTableFilterMeta;
    disableKey?: string;
    totalDisabledRows?: number;
    selectionType?: 'single' | 'checkbox' | 'none';
}

export interface DataTableFilterMeta {
    /**
     * Extra options
     */
    [key: string]:
      | string
      | DataTableFilterMetaData
      | DataTableOperatorFilterMetaData;
  }

export type TableCellComponent = {
    component: Component;
    props?: object;
    model?: any;
    events?: any;
    onChange?: (itemData: any) => void;
    disabled?: boolean;
  };

export interface TableColumn {
    header: string;
    field: string;
    sortable?: boolean;
    bodyTemplate?: (data: any, index: number) => string | undefined;
    bodyComponent?: (data: any, index: number) => TableCellComponent;
}

export interface DataTableSortEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Number of rows to display in new page
     */
    rows: number;
    /**
     * Field to sort against
     */
    sortField: string | undefined;
    /**
     * Sort order as integer
     */
    sortOrder: 1 | 0 | -1 | undefined | null;
  }

export interface DataTablePageEvent extends DataTableSortEvent {
    /**
     * New page number
     */
    page: number;
    /**
     * Total page count
     */
    pageCount: number;
  }

export interface DataTableRowClickEvent {
  /**
   * Browser event.
   */
  originalEvent: Event;
  /**
   * Selected row data.
   */
  data: any;
  /**
   * Row index.
   */
  index: number;
}

export type DataTableEmits = {
    'toggleOption': [data: Data];
    'page': [data: DataTablePageEvent];
    'update:selectedData': [datas: Data[]];
    'sort': [data: DataTableSortEvent];
    'selectedMenuItem': [data: string | undefined];
    'rowSelect': [data: DataTableRowClickEvent];
    'selectData': [data: Data[]];
}

export type IconSort = {
  icon: Icons;
  type?: 'fill' | 'line' | 'none';
}