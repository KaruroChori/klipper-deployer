#!/bin/env bun
import { get_config, get_env } from "../+utils";

try {
    const config = await get_config();
    const { install_packages, pull } = await get_env(config)

    //TODO
}
catch (e) {
    console.error(e)
}
