#!/bin/env bun
import { $ } from "bun";
import { get_config, get_env } from "./+utils";

const main = async () => {
    const config = await get_config();
    const { pull } = await get_env(config)

    if (config.services.klipper?.enabled === true) {
        await pull.klipper();
    }

    if (config.services.moonraker?.enabled === true) {
        await pull.moonraker();
    }

    console.log("Repos pulled!")
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main()
}