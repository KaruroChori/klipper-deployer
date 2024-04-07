import { schema } from "../schemas/main.schema";

export default (opts: schema, instance: string) => `MOONRAKER_DATA_PATH="${opts.install.base}/instances/${instance}/printer_data"
MOONRAKER_ARGS="-m moonraker"
PYTHONPATH="${opts.install.base}/repos/moonraker"
`