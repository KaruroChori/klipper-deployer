#!/bin/env bun
import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"

//By default, all folders are removed except for the venv as it would take forever.
//TODO: Provide option to force the venv reconstruction.

export const install_packages = {
    system: async (opts: schema) => {
        console.log("Running apt-get update...")
        await $`sudo apt update`

        //Basic utilities
        console.log("Installing basic utilities...")
        await $`sudo apt install git wget curl unzip --yes`
    },
    klipper: async (opts: schema) => {
        // Update system package info
        console.log("Running apt-get update...")
        await $`sudo apt update`

        //Packages for python cffi
        let PKGLIST = "virtualenv python3-dev libffi-dev build-essential";
        //kconfig requirements
        PKGLIST = `${PKGLIST} libncurses-dev`
        // hub-ctrl
        PKGLIST = `${PKGLIST} libusb-dev`
        // AVR chip installation and building
        PKGLIST = `${PKGLIST} avrdude gcc-avr binutils-avr avr-libc`
        // ARM chip installation and building
        PKGLIST = `${PKGLIST} stm32flash dfu-util libnewlib-arm-none-eabi`
        PKGLIST = `${PKGLIST} gcc-arm-none-eabi binutils-arm-none-eabi libusb-1.0`

        // Install desired packages
        console.log("Installing the rest of packages...")
        await $`sudo apt install ${PKGLIST} --yes`

        console.log("Updating python virtual environment...")

        // Create virtualenv if it doesn't already exist
        await $`[ ! -d ${PYTHONDIR} ] && virtualenv -p python3 ${PYTHONDIR}`

        //Install / update dependencies
        await $`${PYTHONDIR}/bin/pip install -r ${SRCDIR}/scripts/klippy-requirements.txt`
    },
    moonraker: async (opts: schema) => { },
    fluidd: async (opts: schema) => { },
    mainsail: async (opts: schema) => { }
}