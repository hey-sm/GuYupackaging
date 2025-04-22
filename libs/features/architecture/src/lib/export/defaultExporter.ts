import { Exporter } from '../types';

const defaultExporter: Exporter = (data, _, __, resource) => {
  // TODO
  // jsonExport(data, (err, csv) => downloadCSV(csv, resource))
};
export default defaultExporter;
