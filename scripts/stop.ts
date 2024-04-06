#!/bin/env bun
import { $ } from "bun";
import { get_config, get_env } from "./+utils";

const main = async () => {
    const config = await get_config();
    const { stop } = await get_env(config)

    await stop.system()
}

export default main

import { pathToFileURL } from 'url'
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main()
}