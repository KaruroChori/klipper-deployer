import { $ } from "bun";
import { get_config, get_env } from "./+utils";
const config = await get_config();
const { clone } = await get_env(config)
const filename = `./${config.install.prefix ? `${config.install.prefix}-` : ''}mainsail.service`
await $`echo ${(await import('../templates/klipper.service')).default(config, 'banana')} > ${filename}`
