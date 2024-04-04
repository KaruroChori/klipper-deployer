#!/bin/env bun

import { Value } from "@sinclair/typebox/value"
import { schema } from "@schemas/main.schema.ts"
import { $ } from "bun";
import { default as vv } from "@config/main.json"

await $`cp -r ./config/ ./config.backup-${Date.now()}`

let value = vv
Value.Default(schema, value)
console.log(value)
console.log(...Value.Errors(schema, value))

//Load the current config file.
//Load config file (and fill in default pieces)

//Stop all services
//Delete all service files
//Install deps
//Generate new service files
//Start services anew

//Save the final config file (back up the old one as .bak)
//Save as the current config file.