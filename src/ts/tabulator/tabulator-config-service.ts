import { DataViewTableConfig } from "../models/data-view-table-config";
import { TabulatorColumnAdapter } from "./tabulator-column-adapter";
import { TabulatorConfig } from "./tabulator-models";

/**
 * Service for creating a Tabulator configuration from DataViewTableConfig.
 * Is used to convert the configuration from 2sxc into a format that Tabulator can understand.
 */
export class TabulatorConfigService {
  createTabulatorConfig(
    data: DataViewTableConfig,
    entries: object[]
  ): TabulatorConfig {
    const columnAdapter = new TabulatorColumnAdapter();
    return {
      layout: "fitDataStretch",
      columns: columnAdapter.convert(
        data.dataViewColumnConfig,
        data.columnsAutoShowRemaining,
        entries
      ),
      title: data.title || "2sxc Table",
      dataContentType: "",
      dataQuery: "",
      viewId: data.viewId,
      id: data.id,
      dataViewColumnConfig: data.dataViewColumnConfig,
      search: data.search,
      columnsAutoShowRemaining: data.columnsAutoShowRemaining,
      pagination: data.pagingMode === "true",
      paginationSize: data.pagingSize ?? 10,
      guid: "",
    } as TabulatorConfig;
  }
}
