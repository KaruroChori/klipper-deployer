#!/bin/env bun
import { $ } from "bun";

const main = async () => {
    //TODO cp config to config-timestamp
    //Symbol link config-current to the latest config-timestamp
    const newname = `./backups/config-${Date.now()}`
    await $`mkdir -p ./backups/ && cp -r ./config ${newname}`
    await $`ln -sfn  ${newname} $PWD/current-config `

    console.log(`Done!`)
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main()
}