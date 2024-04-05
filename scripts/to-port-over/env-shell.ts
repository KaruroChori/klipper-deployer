#!/bin/env bun
//Prepare a shell open to assist the make menuconfig and make operations.
//Portable toolchains are added to the path to make sure they are visible.

import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"
import { get_config } from "../+utils";
import os from 'node:os'

const config = await get_config();

if (os.platform() !== 'linux') {
    console.error('This utility can only be run on linux')
    process.exit(1)
}

const avr = config.install.toolchains?.avr
const arm32 = config.install.toolchains?.arm32

await $`cd ${config.install.base}/repos/klipper && export PATH=$PATH${avr ? `:${avr}` : ``}${arm32 ? `:${arm32}` : ``} && /bin/env screen`