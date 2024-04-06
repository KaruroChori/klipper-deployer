#!/bin/env bun
import { $ } from "bun";

const main = async () => {
    const config = await get_config();
    const { clone } = await get_env(config)


    await $`rm -rf ${config.install.base}/repos`
    await $`mkdir -p ${config.install.base}/repos`

    if (config.services.klipper?.enabled === true) {
        await clone.klipper();
    }

    if (config.services.moonraker?.enabled === true) {
        await clone.moonraker();
    }

    if (config.services.mainsail?.enabled === true) {
        await clone.mainsail();
    }

    if (config.services.fluidd?.enabled === true) {
        await clone.fluidd();
    }

    console.log("Images pulled and packages installed!")
}

export default main

import { pathToFileURL } from 'url'
import { get_config, get_env } from './+utils';
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main()
}