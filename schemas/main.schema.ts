import { Static, Type as t } from "@sinclair/typebox"
import { readdirSync, existsSync } from 'node:fs'

const klipper_patches = existsSync(`${import.meta.dir}/../patches/klipper/`) ? Array.from(readdirSync(`${import.meta.dir}/../patches/klipper/`)).map(x => x.substring(0, x.length - `.patch`.length)) : []
const moonraker_patches = existsSync(`${import.meta.dir}/../patches/moonraker/`) ? Array.from(readdirSync(`${import.meta.dir}/../patches/moonraker/`)).map(x => x.substring(0, x.length - `.patch`.length)) : []

const w = t.Object({
    "install": t.Object({
        base: t.String({ default: `${process.env.PWD}` }),
        "nfs": t.Optional(t.String({ description: "If set, the gcode folder will include a remote subdir which is mounted to a remote location" })),
        user: t.String({ default: process.env.USER ?? 'user', description: "The user to use to run those services" }),
        systemd: t.String({ default: '/etc/systemd/system', description: "Folder for the system deamon" }),
        prefix: t.Optional(t.String({ description: 'Prefix for this configuration, only needed if you have multiple on the same system.' })),
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
            commit: t.Optional(t.String({ description: 'Alternative to branch, select the exact commit' })),
            patches: t.Optional(t.Array(t.Union(klipper_patches.map(x => t.Literal(x))), { description: 'List of patches to apply to the cloned repo' }))
        }, { default: {}, additionalProperties: false })),
        "moonraker": t.Optional(t.Object({
            enabled: t.Boolean({ default: false }),
            repo: t.String({ default: 'https://github.com/Arksine/moonraker' }),
            branch: t.String({ default: 'master', description: 'The branch to use to copy from' }),
            commit: t.Optional(t.String({ description: 'Alternative to branch, select the exact commit' })),
            speedsup: t.Optional(t.Boolean({ default: true, description: 'Install additional packages' })),
            patches: t.Optional(t.Array(t.Union(klipper_patches.map(x => t.Literal(x))), { description: 'List of patches to apply to the cloned repo' }))
        }, { default: {}, additionalProperties: false })),
        "fluidd": t.Optional(t.Object({
            enabled: t.Boolean({ default: false }),
            repo: t.String({ default: 'https://github.com/fluidd-core/fluidd' }),
            tag: t.String({ default: 'v1.29.1' }),
            port: t.Number({ default: 8000 })
        }, { default: {}, additionalProperties: false })),
        "mainsail": t.Optional(t.Object({
            enabled: t.Boolean({ default: false }),
            repo: t.String({ default: 'https://github.com/mainsail-crew/mainsail' }),
            tag: t.String({ default: 'v2.10.0' }),
            port: t.Number({ default: 8000 })
        }, { default: {}, additionalProperties: false })),
    }, { default: {}, additionalProperties: false })
    , instances: t.Record(t.String(), t.Object({
        "moonraker": t.Object({
            "port": t.Number()
        }, { additionalProperties: false }),
        "nfs": t.Optional(t.String({ description: "If set, the gcode folder will include an instance-specific remote subdir mounted from a remote location" })),
    }), { default: { 0: { moonraker: { port: 7125 } } } })
}, { default: {}, additionalProperties: false })


export const schema = w
export type schema = Static<typeof w>