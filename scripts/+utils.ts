
import { Value } from "@sinclair/typebox/value"
import { schema } from "../schemas/main.schema.ts"
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

    const t = Value.Default(schema, config)
    console.error(...Value.Errors(schema, config))

    if (t === false) {
        console.error('Config file not valid!')
        process.exit(1)
    }

    return config
}


export async function get_env(config: schema) {
    if (os.platform() !== 'linux') {
        console.error('This utility can only be run on linux')
        process.exit(1)
    }


    const distroInfo = await Bun.file('/etc/os-releases').text()
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
