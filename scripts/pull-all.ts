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

    const install_packages = await get_env()

    await install_packages.system(config);


    if (config.services.klipper?.enabled === true) {
        console.log('Pulling klipper')
        await $`cd ${config.install.base}/repos/ &&  git pull`
        await install_packages.klipper(config);
    }

    if (config.services.moonraker?.enabled === true) {
        console.log('Pulling moonraker')
        await $`cd ${config.install.base}/repos/ &&  git pull`
        await install_packages.moonraker(config);
    }

    if (config.services.mainsail?.enabled === true) {
        console.log('Cloning mainsail')
        await $`cd ${config.install.base}/repos/mainsail && rm -rf ./* && wget ${config.services.mainsail.repo}/releases/download/${config.services.mainsail.tag}/mainsail.zip && unzip mainsail.zip && rm mainsail.zip`
        await install_packages.mainsail(config);
    }

    if (config.services.fluidd?.enabled === true) {
        console.log('Cloning fluidd')
        await $`cd ${config.install.base}/repos/fluidd && rm -rf ./* &&  wget ${config.services.fluidd.repo}/releases/download/${config.services.fluidd.tag}/fluidd.zip && unzip fluidd.zip && rm fluidd.zip`
        await install_packages.fluidd(config);
    }

    console.log("Images pulled and packages installed!")
}
catch (e) {
    console.error(e)
}
