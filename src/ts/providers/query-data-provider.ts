import { DataProvider } from "./data-provider";
import { Sxc } from "@2sic.com/2sxc-typings";

export class QueryDataProvider extends DataProvider {
  private sxc: Sxc;
  private query: string;
  private linkParameters?: string;

  constructor(sxc: Sxc, query: string, linkParameters?: string) {
    // Build the full API URL
    const endpoint = `app/auto/query/${query}${
      linkParameters ? `?${linkParameters}` : ""
    }`;
    const apiUrl = sxc.webApi.url(endpoint);

    // Initialize the base provider
    super(apiUrl, sxc.webApi.headers("GET"));

    // Store references for later use
    this.sxc = sxc;
    this.query = query;
    this.linkParameters = linkParameters;
  }

  /**
   * Override getInitialData to include relationship processing
   */
  async getInitialData(): Promise<any[]> {
    try {
      // Build endpoint URL including linkParameters if provided
      let endpoint = `app/auto/query/${this.query}${
        this.linkParameters ? this.linkParameters : ""
      }`;

      // Fetch data from the endpoint
      const data = await this.sxc.webApi.fetchJson(endpoint);

      // Process the data using our method
      return this.processQueryData(data, this.query);
    } catch (error) {
      console.error(`Error loading data from query ${this.query}:`, error);
      return [];
    }
  }

  /**
   * Process raw data without fetching it - can be used by ajaxResponse
   */
  processData(data: string) {
    return this.processQueryData(data, this.query);
  }

  /**
   * Private helper to process query data to handle relationships
   */
  private processQueryData(data: any, queryName: string): any[] {
    let mainKey = queryName;
    let mainItems = data[mainKey] || data["Default"];

    if (!Array.isArray(mainItems)) return [];

    const lookupMaps: Record<string, Record<number, any>> = {};
    Object.keys(data).forEach((key) => {
      if (key === mainKey) return;
      const arr = data[key];
      if (
        Array.isArray(arr) &&
        arr.length > 0 &&
        arr[0] &&
        Object.prototype.hasOwnProperty.call(arr[0], "Id")
      ) {
        lookupMaps[key] = arr.reduce((map: Record<number, any>, item: any) => {
          map[item.Id] = item;
          return map;
        }, {});
      }
    });

    const combined = mainItems.map((item: any) => {
      const newItem: any = {};
      Object.keys(item).forEach((field) => {
        let value = item[field];
        if (lookupMaps[field] && Array.isArray(value)) {
          value =
            value.length > 0
              ? lookupMaps[field][value[0].Id] || value[0]
              : null;
        }
        // Convert PascalCase to lowerCamelCase
        const camelField = field.charAt(0).toLowerCase() + field.slice(1);
        newItem[camelField] = value;
      });
      return newItem;
    });

    return combined;
  }
}
