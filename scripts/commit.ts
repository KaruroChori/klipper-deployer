#!/bin/env bun

const main = async () => {
    //TODO cp config to config-timestamp
    //Symbol link config-current to the latest config-timestamp

}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main()
}