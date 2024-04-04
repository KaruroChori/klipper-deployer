import { Static, Type as t } from "@sinclair/typebox"

const w = t.Object({
    "install": t.Object({
        base: t.String({ default: `${process.env.HOME}/klipper-deployer` }),
        "gcode-nfs": t.Optional(t.String({ description: "If set, the gcode folder will include a remote subdir which is mounted to a remote location" })),
        user: t.String({ default: process.env.USER ?? 'user', description: "The user to use to run those services" }),
        systemd: t.String({ default: '/etc/systemd/system', description: "Folder for the system deamon" }),
        toolchains: t.Optional(t.Object({
            avr: t.Optional(t.String({ description: 'Path for an external avr toolchain' })),
            arm32: t.Optional(t.String({ description: 'Path for an external arm32 toolchain' }))
        }))
    }, { default: {}, additionalProperties: false }),
    "services": t.Object({
        "klipper": t.Optional(t.Object({
            enabled: t.Boolean({ default: true }),
            arch: t.Array(t.Union(
                [
                    t.Literal('runtime', { description: "Only the dependencies needed to have the runtime working are installed" }),
                    t.Literal('all', { description: "All dependencies are installed, usually needed if you want to build on the same system" }),
                    t.Literal('avr', { description: "AVR processors support" }),
                    t.Literal('arm32', { description: "ARM32 processors support" })
                ],
            ), { default: ["runtime"] }),
            repo: t.String({ default: 'https://github.com/Klipper3d/klipper' }),
            branch: t.String({ default: 'master', description: 'The branch to use to copy from' }),
            commit: t.Optional(t.String({ description: 'Alternative to branch, select the exact commit' }))
        }, { default: {}, additionalProperties: false })),
        "moonraker": t.Optional(t.Object({
            enabled: t.Boolean({ default: false }),
            repo: t.String({ default: 'https://github.com/Arksine/moonraker' }),
            branch: t.String({ default: 'master', description: 'The branch to use to copy from' }),
            commit: t.Optional(t.String({ description: 'Alternative to branch, select the exact commit' }))
        }, { default: {}, additionalProperties: false })),
        "fluidd": t.Optional(t.Object({
            enabled: t.Boolean({ default: false }),
            repo: t.String({ default: 'https://github.com/fluidd-core/fluidd' }),
            tag: t.String({ default: 'v1.29.1' })

        }, { default: {}, additionalProperties: false })),
        "mainsail": t.Optional(t.Object({
            enabled: t.Boolean({ default: false }),
            repo: t.String({ default: 'https://github.com/mainsail-crew/mainsail' }),
            tag: t.String({ default: 'v2.10.0' })
        }, { default: {}, additionalProperties: false })),
    }, { default: {}, additionalProperties: false })
    , instances: t.Record(t.String(), t.Object({
        "moonraker": t.Object({
            "port": t.Number()
        }, { additionalProperties: false })
    }), { default: { 0: { moonraker: { port: 7125 } } } })
}, { default: {}, additionalProperties: false })


export const schema = w
export type schema = Static<typeof w>