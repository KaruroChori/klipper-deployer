#!/bin/env bun
import { get_config, get_env } from './+utils';

const main = async () => {

    //Scroll all elements in the config file and build those entries.
    const config = await get_config();
    const { make_instance, delete_instance } = await get_env(config)

    /*
        A = list folders
        B = list from config

        Ignore A & B
        Add B-A&B
        Remove A-A&B (if flag is set)
    */

    //If there are folders left out, those must be removed (optional via flag)
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main()
}