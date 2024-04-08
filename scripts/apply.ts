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
        console.log(`Adding [${I}]`)

        await make_instance(I).system()
        if (config.services.klipper?.enabled) {
            await make_instance(I).klipper()
            console.log('Debug1')
        }
        if (config.services.moonraker?.enabled) {
            console.log('Debug2')

            await make_instance(I).moonraker()

            console.log('Debug13')

        }
    }

    if (remove) for (const I of LEFT_A) {
        console.log(`Removing [${I}]`)

        if (config.services.klipper?.enabled) {
            await delete_instance(I).klipper()
        }
        if (config.services.moonraker?.enabled) {
            await delete_instance(I).moonraker()
        }
        await delete_instance(I).system()
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