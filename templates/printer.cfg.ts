import { schema } from "../schemas/main.schema";

export default (opts: schema, instance: string) => `[pause_resume]

[display_status]

[virtual_sdcard]
path: ${opts.install.base}/instances/${instance}/printer_data/gcodes`