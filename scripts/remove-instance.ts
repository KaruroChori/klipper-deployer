#!/bin/env bun


import { $ } from "bun";
import { get_config, get_env } from "./@utils";

try {
    const config = await get_config();
    const { make_instance } = await get_env(config);

    //TODO
}
catch (e) {
    console.error(e)
}
