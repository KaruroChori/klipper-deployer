
import { Value } from "@sinclair/typebox/value"
import { schema } from "@schemas/main.schema.ts"

export async function get_config() {
    let config: schema;
    try {
        config = JSON.parse(await Bun.file('./config/main.json').text())
    }
    catch (e) {
        console.log('No config file found, run the gen-config script or write one!')
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


export async function get_env() {
    const distroInfo = await Bun.file('/etc/os-releases').text()
    //TODO parsing

    const install_packages = (await import('./targets/debian-12')).install_packages

    return install_packages
}