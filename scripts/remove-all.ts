#!/bin/env bun


import { $ } from "bun";
import { get_config, get_env } from "./@utils";


const config = await get_config();
const { make_instance } = await get_env();

//TODO