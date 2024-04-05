#!/bin/env bun
//Pull all files and repositiories for services as specified in the config file.

import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"
import { Value } from "@sinclair/typebox/value";
import { get_config, get_env } from "../+utils";
import os from 'node:os'

try {
    const config = await get_config();
    const { install_packages, pull } = await get_env(config)

    await install_packages.system();


    if (config.services.klipper?.enabled === true) {
        await pull.klipper()
        await install_packages.klipper();
    }

    if (config.services.moonraker?.enabled === true) {
        await pull.moonraker()
        await install_packages.moonraker();
    }

    if (config.services.mainsail?.enabled === true) {
        await pull.mainsail()
        await install_packages.mainsail();
    }

    if (config.services.fluidd?.enabled === true) {
        await pull.fluidd()
        await install_packages.fluidd();
    }

    console.log("Images pulled and packages installed!")
}
catch (e) {
    console.error(e)
}