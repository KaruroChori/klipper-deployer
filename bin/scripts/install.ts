#!/bin/env bun

import { Value } from "@sinclair/typebox/value"
import { schema } from "@schemas/main.schema.ts"
import { $ } from "bun";
import { default as vv } from "@config/main.json"
import os from 'node:os'

//Create python virtual environment
async function create_virtualenv() {
    console.log("Updating python virtual environment...")

    // Create virtualenv if it doesn't already exist
    await $`[ ! -d ${PYTHONDIR} ] && virtualenv -p python3 ${PYTHONDIR}`

    //Install / update dependencies
    await $`${PYTHONDIR}/bin/pip install -r ${SRCDIR}/scripts/klippy-requirements.txt`
}

//await $`cp -r ./config/ ./config.backup-${Date.now()}`

let value = vv
Value.Default(schema, value)
console.log(value)
console.log(...Value.Errors(schema, value))

if (os.platform() !== 'linux') {
    console.error('This utility can only be run on linux')
    process.exit(1)
}

try {
    const distroInfo = await Bun.file('/etc/os-releases').text()
    //TODO parsing

    const install_packages = (await import('@scripts/targets/debian-12')).install_packages
}
catch (e) {
    console.error("Cannot find file /etc/os-releases to determine the distribution running.\nCannot enforce an installing strategy.")
}