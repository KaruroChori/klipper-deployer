#!/bin/env bun


import { $ } from "bun";
import { get_config, get_env } from "./@utils";


const config = await get_config();
const { make_instance } = await get_env();

if (os.platform() !== 'linux') {
    console.error('This utility can only be run on linux')
    process.exit(1)
}

//By default, all folders already existing are skipped.
//TODO: Add mechanism for updating the older ones?

try {
    const distroInfo = await Bun.file('/etc/os-releases').text()
    //TODO parsing

    const install_packages = await get_env();
} catch (e) {
    console.error(e)
}
