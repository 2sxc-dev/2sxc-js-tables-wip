import { Options } from "tabulator-tables";
import { DataViewTableConfig } from "../ts/models/data-view-table-config";
import { ITableCustomizer } from "./ITableCustomizer";

export class CustomizeSkillsAndGrowth implements ITableCustomizer {
  // Store the targeted GUID
  private readonly targetGuid = "96d0d969-dd03-45fe-ab58-351c9ff91236";

  shouldApply(config: DataViewTableConfig): boolean {
    return config.guid === this.targetGuid;
  }

  customizeConfig(config: DataViewTableConfig): DataViewTableConfig {
    return config;
  }

  customizeTabulator(options: Options): Options {
    // Modify column formatters
    if (options.columns) {
      options.columns.forEach((column) => {
        // Customize progress formatter
        if (column.formatter === "progress") {
          column.formatterParams = {
            ...column.formatterParams,
            max: 9,
          };
        }

        // Customize date formatter
        if (column.formatter === "datetime") {

          column.formatterParams = {
            ...column.formatterParams,
            outputFormat: "yyyy-MM",
          };
        }
      });
    }

    return options;
  }
}
