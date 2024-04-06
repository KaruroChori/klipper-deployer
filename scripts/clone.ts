#!/bin/env bun

const main = async () => { }

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main()
}