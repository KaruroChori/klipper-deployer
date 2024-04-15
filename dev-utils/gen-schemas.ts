#!/bin/env bun

import { schema } from '../schemas/main.schema'

await Bun.write(`./schemas/json/${process.env.SCHEMA_VERSION}.json`, JSON.stringify(schema, null, 2))