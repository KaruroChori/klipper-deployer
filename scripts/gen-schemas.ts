#!/bin/env bun

import { SCHEMA_VERSION, schema } from '../schemas/main.schema'

await Bun.write(`./schemas/json/${SCHEMA_VERSION}.json`, JSON.stringify(schema, null, 2))