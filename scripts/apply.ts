#!/bin/env bun
import { get_config, get_env } from './+utils';
import { readdirSync, existsSync } from "node:fs"
const main = async (remove: boolean = false) => {
    /*
        A = list folders
        B = list from config

        Ignore A & B
        Add B-A&B
        Remove A-A&B (if flag is set)
    */

    //If there are folders left out, those must be removed (optional via flag)

    //Scroll all elements in the config file and build those entries.
    const config = await get_config();
    const { make_instance, delete_instance } = await get_env(config)


    const A = existsSync('./instances') ? readdirSync('./instances/') : []
    const B = Object.keys(config.instances)

    const A_AND_B = A.filter(value => B.includes(value))
    const LEFT_B = B.filter(value => !A.includes(value))
    const LEFT_A = A.filter(value => !B.includes(value))

    for (const I of A_AND_B) {
        console.warn(`Skipping [${I}] as there is already a version spawned`)
    }

    for (const I of LEFT_B) {
        const mk_instance = make_instance(I);
        console.log(`Adding [${I}]`)

        await mk_instance.system()
        if (config.services.klipper?.enabled) {
            await mk_instance.klipper()
        }
        if (config.services.moonraker?.enabled) {
            await mk_instance.moonraker()
        }
    }

    if (remove) for (const I of LEFT_A) {
        const dl_instance = delete_instance(I);
        console.log(`Removing [${I}]`)

        if (config.services.klipper?.enabled) {
            await dl_instance.klipper()
        }
        if (config.services.moonraker?.enabled) {
            await dl_instance.moonraker()
        }
        await dl_instance.system()
    }
    else {
        for (const I of LEFT_A) {
            console.warn(`[${I}] no longer in the config file. Use --remove to force its removal`)
        }
    }

}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main()
}