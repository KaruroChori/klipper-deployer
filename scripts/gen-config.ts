#!/bin/env bun
//Generate the basic config file if there is not one already.

import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"
import { Value } from "@sinclair/typebox/value";
import fs from 'node:fs/promises'


if (!await fs.exists('./config')) {
    await $`mkdir ./config`;
}
else {
    //await $`cp -r ./config/ ./config.backup-${Date.now()}`
    await $`ls`
}
let config: schema | {} | undefined = undefined;
console.log('ss')

try {
    config = JSON.parse(await Bun.file('./config/main.json').text())
}
catch (e) {
    console.log('No config file, creating a base one.')
    config = {}
}
Value.Default(schema, config)
console.error(...Value.Errors(schema, config))


await Bun.write('./config/main.json', JSON.stringify(config, undefined, 4))

