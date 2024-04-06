#!/bin/env bun
import { $ } from "bun";
import { get_config, get_env } from "./+utils";

const main = async () => {
    const config = await get_config();
    const { install_packages } = await get_env(config)

    await install_packages.system();

    if (config.services.klipper?.enabled === true) {
        await install_packages.klipper();
    }

    if (config.services.moonraker?.enabled === true) {
        await install_packages.moonraker();
    }

    if (config.services.mainsail?.enabled === true) {
        await install_packages.mainsail();
    }

    if (config.services.fluidd?.enabled === true) {
        await install_packages.fluidd();
    }

    console.log("Deps added, venvs done, global services mounted.")
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main()
}