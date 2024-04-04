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

    await $`rm -rf ${config.install.base}/repos`
    await $`mkdir -p ${config.install.base}/repos`

    if (config.services.klipper?.enabled === true) {
        console.log('Cloning klipper')
        await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.klipper.repo} --branch ${config.services.klipper.branch} --depth 1`
        await install_packages.klipper(config);
    }

    if (config.services.moonraker?.enabled === true) {
        console.log('Cloning moonraker')
        await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.moonraker.repo} --branch ${config.services.moonraker.branch} --depth 1`
        await install_packages.moonraker(config);
    }

    if (config.services.mainsail?.enabled === true) {
        console.log('Cloning mainsail')
        await $`mkdir -p ${config.install.base}/repos/mainsail && cd ${config.install.base}/repos/mainsail &&  wget ${config.services.mainsail.repo}/releases/download/${config.services.mainsail.tag}/mainsail.zip && unzip mainsail.zip && rm mainsail.zip`
        await install_packages.mainsail(config);
    }

    if (config.services.fluidd?.enabled === true) {
        console.log('Cloning fluidd')
        await $`mkdir -p ${config.install.base}/repos/fluidd && cd ${config.install.base}/repos/fluidd &&  wget ${config.services.fluidd.repo}/releases/download/${config.services.fluidd.tag}/fluidd.zip && unzip fluidd.zip && rm fluidd.zip`
        await install_packages.fluidd(config);
    }

    console.log("Images pulled and packages installed!")
}
catch (e) {
    console.error(e)
}
