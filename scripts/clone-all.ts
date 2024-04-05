#!/bin/env bun
//Pull all files and repositiories for services as specified in the config file.

import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"
import { Value } from "@sinclair/typebox/value";
import { get_config, get_env } from "./@utils";
import os from 'node:os'

const config = await get_config();

if (os.platform() !== 'linux') {
    console.error('This utility can only be run on linux')
    process.exit(1)
}

try {
    const distroInfo = await Bun.file('/etc/os-releases').text()
    //TODO parsing

    const { install_packages, clone } = await get_env()

    await install_packages.system(config);

    await $`rm -rf ${config.install.base}/repos`
    await $`mkdir -p ${config.install.base}/repos`

    if (config.services.klipper?.enabled === true) {
        await clone.klipper(config);
        await install_packages.klipper(config);

    }

    if (config.services.moonraker?.enabled === true) {
        await clone.moonraker(config);
        await install_packages.moonraker(config);

    }

    if (config.services.mainsail?.enabled === true) {
        await clone.mainsail(config);
        await install_packages.mainsail(config);

    }

    if (config.services.fluidd?.enabled === true) {
        await clone.fluidd(config);
        await install_packages.fluidd(config);

    }

    console.log("Images pulled and packages installed!")
}
catch (e) {
    console.error(e)
}
