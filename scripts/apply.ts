#!/bin/env bun

const main = async () => {

    //Scroll all elements in the config file and build those entries.

    //If there are folders left out, those must be removed (optional via flag)
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main()
}