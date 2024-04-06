#!/bin/env bun
import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"
import { Value } from "@sinclair/typebox/value";
import fs from 'node:fs/promises'

const main = async () => {
    //If the file does not exist prepare the folder
    if (!await fs.exists('./config')) {
        await $`mkdir ./config`;
    }

    let config: schema | {} | undefined = undefined;

    try {
        config = JSON.parse(await Bun.file('./config/main.json').text())
    }
    catch (e) {
        console.warn('No config file, creating a base one.')
        config = {}
    }
    Value.Default(schema, config)
    console.error(...Value.Errors(schema, config))

    await Bun.write('./config/main.json', JSON.stringify(config, undefined, 4))

    console.log('Config file added!')
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main()
}