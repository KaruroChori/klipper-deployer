#!/bin/env bun
//Pull all files and repositiories as specified in the config file.

import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"
import { Value } from "@sinclair/typebox/value";

let config: schema;
try {
    config = JSON.parse(await Bun.file('./config/main.json').text())
}
catch (e) {
    console.log('No config file found, run the gen-config script or write one!')
    process.exit(1)
}

Value.Default(schema, config)
console.error(...Value.Errors(schema, config))

await $`rm -rf ${config.install.base}/repos`
await $`mkdir -p ${config.install.base}/repos`

if (config.services.klipper?.enabled === true) {
    console.log('Pulling klipper')
    await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.klipper.repo} --branch ${config.services.klipper.branch} --depth 1`
}

if (config.services.moonraker?.enabled === true) {
    console.log('Pulling moonraker')
    await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.moonraker.repo} --branch ${config.services.moonraker.branch} --depth 1`

}

if (config.services.mainsail?.enabled === true) {
    console.log('Pulling mainsail')
    await $`mkdir -p ${config.install.base}/repos/mainsail && cd ${config.install.base}/repos/mainsail &&  wget ${config.services.mainsail.repo}/releases/download/${config.services.mainsail.tag}/mainsail.zip && unzip mainsail.zip && rm mainsail.zip`

}

if (config.services.fluidd?.enabled === true) {
    console.log('Pulling fluidd')
    await $`mkdir -p ${config.install.base}/repos/fluidd && cd ${config.install.base}/repos/fluidd &&  wget ${config.services.fluidd.repo}/releases/download/${config.services.fluidd.tag}/fluidd.zip && unzip fluidd.zip && rm fluidd.zip`

}

console.log("All done!")