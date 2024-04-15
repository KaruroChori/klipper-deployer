
import { Value } from "@sinclair/typebox/value"
import { SCHEMA_VERSION, schema } from "../schemas/main.schema.ts"
import os from 'node:os'

export async function get_config() {
    let config: schema;
    try {
        config = JSON.parse(await Bun.file('./current-config/main.json').text())
    }
    catch (e) {
        console.log('No config file found, run the init script, write and commit one!')
        process.exit(1)
    }

    Value.Default(schema, config)
    if (Value.Errors.length != 0) {
        console.error(`Errors in the config file!`)
        console.error(...Value.Errors(schema, config))
        process.exit(2)
    }
    if (config.version != SCHEMA_VERSION) {
        console.error(`The selected configuration is incompatible with the current schema. If possible migrate it, or manually fix it before progressing.`)
        process.exit(3)
    }
    return config
}


export async function get_env(config: schema) {
    if (os.platform() !== 'linux') {
        console.error('This utility can only be run on linux')
        process.exit(4)
    }


    const distroInfo = await Bun.file('/etc/os-release').text()
    //TODO parsing

    //TODO Select the relevant target, not just a random one
    const t = (await import('./targets/debian-12'))
    const w = {
        install_packages: t.install_packages(config),
        uninstall_packages: t.uninstall_packages(config),
        clean: t.clean(config),
        clone: t.clone(config),
        pull: t.pull(config),
        make_instance: (i: string) => t.make_instance(config, i),
        delete_instance: (i: string) => t.delete_instance(config, i),
        start: t.start(config),
        stop: t.stop(config)
    }

    return w
}
