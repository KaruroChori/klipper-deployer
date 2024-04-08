#!/bin/env bun
import { $ } from "bun";
import { get_config, get_env } from "./+utils";
import { readdirSync, existsSync } from "node:fs"

const main = async () => {
    const config = await get_config();
    const { uninstall_packages, make_instance, delete_instance } = await get_env(config)

    const A = existsSync('./instances') ? readdirSync('./instances/') : []

    for (const I of A) {
        const dl_instance = delete_instance(I);
        console.log(`Removing [${I}]`)

        if (config.services.klipper?.enabled) {
            await dl_instance.klipper()
        }
        if (config.services.moonraker?.enabled) {
            await dl_instance.moonraker()
        }
        await dl_instance.system()
    }

    if (config.services.klipper?.enabled === true) {
        await uninstall_packages.klipper();
    }

    if (config.services.moonraker?.enabled === true) {
        await uninstall_packages.moonraker();
    }

    if (config.services.mainsail?.enabled === true) {
        await uninstall_packages.mainsail();
    }

    if (config.services.fluidd?.enabled === true) {
        await uninstall_packages.fluidd();
    }

    await uninstall_packages.system();

    console.log("Global services uninstalled, venvs removed!")
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main()
}