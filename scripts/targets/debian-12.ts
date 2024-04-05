#!/bin/env bun
import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"

//By default, all folders are removed except for the venv as it would take forever.
//TODO: Provide option to force the venv reconstruction.

export const install_packages = {
    system: async (config: schema) => {
        console.log("Running apt-get update...")
        await $`sudo apt update`

        //Basic utilities
        console.log("Installing basic utilities...")
        await $`sudo apt install git wget curl unzip nfs-common --yes`
    },
    klipper: async (config: schema) => {
        // Update system package info
        console.log("Running apt-get update...")
        await $`sudo apt update`

        //Packages for python cffi
        let PKGLIST = "virtualenv python3-dev libffi-dev build-essential";
        //kconfig requirements
        PKGLIST = `${PKGLIST} libncurses-dev`
        // hub-ctrl
        PKGLIST = `${PKGLIST} libusb-dev libusb-1.0`
        // AVR chip installation
        PKGLIST = `${PKGLIST} avrdude`
        if (config.services.klipper?.arch.includes('all') || config.services.klipper?.arch.includes('avr')) {
            // AVR chip building
            PKGLIST = `${PKGLIST}  gcc-avr binutils-avr avr-libc`
        }
        // ARM chip installation
        PKGLIST = `${PKGLIST} stm32flash dfu-util`
        if (config.services.klipper?.arch.includes('all') || config.services.klipper?.arch.includes('arm32')) {
            // ARM chip  building
            PKGLIST = `${PKGLIST} libnewlib-arm-none-eabi`
            PKGLIST = `${PKGLIST} gcc-arm-none-eabi binutils-arm-none-eabi`
        }
        // Install desired packages
        console.log("Installing the rest of packages...")
        await $`sudo apt install ${PKGLIST} --yes`

        console.log("Updating python virtual environment...")

        // Create virtualenv if it doesn't already exist
        await $`[ ! -d ${config.install.base}/klippy_env ] && virtualenv -p python3 ${config.install.base}/klippy_env`
        //Install / update dependencies
        await $`${config.install.base}/klippy_env/bin/pip install -r ${config.install.base}/repos/klipper/scripts/klippy-requirements.txt`
    },
    moonraker: async (config: schema) => {
        //TODO: Basically an alternative implementation for ./install-moonraker.sh split across make_intance and here.
        //await $`cd ${config.install.base}/repos/moonraker/scripts && ./install-moonraker.sh`
    },
    fluidd: async (config: schema) => {
        //TODO
    },
    mainsail: async (config: schema) => {
        //TODO
    }
}

//Code which creates the specific instance running
export const make_instance = {
    klipper: async (config: schema) => {
        //TODO
    },
    moonraker: async (config: schema) => {
        //TODO
    },
    fluidd: async (config: schema) => {
        //TODO
    },
    mainsail: async (config: schema) => {
        //TODO
    }
}

//Code which creates the specific instance running
export const delete_instance = {
    klipper: async (config: schema) => {
        //TODO
    },
    moonraker: async (config: schema) => {
        //TODO
    },
    fluidd: async (config: schema) => {
        //TODO
    },
    mainsail: async (config: schema) => {
        //TODO
    }
}