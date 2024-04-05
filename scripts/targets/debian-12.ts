#!/bin/env bun
import { $ } from "bun";
import { schema } from "@schemas/main.schema.ts"

//TODO: Once new platforms will be supported, move portable code to @commons.

export const install_packages = {
    system: async (config: schema) => {
        // Update system package info
        console.log("Running apt-get update...")
        await $`sudo apt update`

        //Basic utilities
        console.log("Installing basic utilities...")
        await $`sudo apt install git wget curl unzip nfs-common --yes`
    },
    klipper: async (config: schema) => {
        //Packages for python cffi
        let PKGLIST = "python3 virtualenv python3-dev libffi-dev build-essential";
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
        console.log("Installing the rest of the packages...")
        await $`sudo apt install ${PKGLIST} --yes`

        console.log("Updating python virtual environment...")

        // Create virtualenv if it doesn't already exist
        await $`[ ! -d ${config.install.base}/klippy_env ] && virtualenv -p python3 ${config.install.base}/klippy_env`
        //Install / update dependencies
        await $`${config.install.base}/klippy_env/bin/pip install -r ${config.install.base}/repos/klipper/scripts/klippy-requirements.txt`
    },
    moonraker: async (config: schema) => {
        //TODO: Basically an alternative implementation for ./install-moonraker.sh split across make_intance and here.

        let PKGLIST = ""
        PKGLIST = `${PKGLIST} python3 python3-virtualenv python3-dev liblmdb-dev`
        PKGLIST = `${PKGLIST} libopenjp2-7 libsodium-dev zlib1g-dev libjpeg-dev`
        PKGLIST = `${PKGLIST} packagekit wireless-tools curl`

        console.log("Installing Moonraker Dependencies:")
        await $`sudo apt install ${PKGLIST} --yes`

        // Create virtualenv if it doesn't already exist
        await $`[ ! -d ${config.install.base}/moonraker_env ] && virtualenv -p python3 ${config.install.base}/moonraker_env`
        //Install / update dependencies
        await $`${config.install.base}/moonraker_env/bin/pip install -r ${config.install.base}/repos/moonraker/scripts/moonraker-requirements.txt`
        if (config.services.moonraker?.speedsup === true) {
            await $`${config.install.base}/moonraker_env/bin/pip install -r ${config.install.base}/repos/moonraker/scripts/moonraker-speedsup.txt`
        }

    },
    fluidd: async (config: schema) => {
        console.log("Removing previous instance if present:")
        await $`sudo service stop fluidd`
        await $`sudo rm ${config.install.systemd}/fluidd.service`
        let PKGLIST = "python3";
        console.log("Installing Fluidd dependencies:")
        await $`sudo apt install ${PKGLIST} --yes`
        console.log("Generating service files:")
        await $`sudo echo ${(await import('@templates/fluidd.service')).default(config)} > ${config.install.systemd}/fluidd.service`
        await $`sudo service start fluidd`

    },
    mainsail: async (config: schema) => {
        console.log("Removing previous instance if present:")
        await $`sudo service stop mainsail`
        await $`sudo rm ${config.install.systemd}/mainsail.service`
        let PKGLIST = "python3";
        console.log("Installing mainsail dependencies:")
        await $`sudo apt install ${PKGLIST} --yes`
        console.log("Generating service files:")
        await $`sudo echo ${(await import('@templates/mainsail.service')).default(config)} > ${config.install.systemd}/mainsail.service`
        await $`sudo service start mainsail`

    }
}

export const uninstall_packages = {
    system: async (config: schema) => {

    },
    klipper: async (config: schema) => {
        console.log("Removing klipper venv:")
        await $`rm -rf ${config.install.base}/moonraker_env`

    },
    moonraker: async (config: schema) => {
        console.log("Removing moonraker venv:")
        await $`rm -rf ${config.install.base}/moonraker_env`

    },
    fluidd: async (config: schema) => {
        console.log("Removing previous instance if present:")
        await $`sudo service stop fluidd`
        await $`sudo rm ${config.install.systemd}/fluidd.service`
    },
    mainsail: async (config: schema) => {
        console.log("Removing previous instance if present:")
        await $`sudo service stop mainsail`
        await $`sudo rm ${config.install.systemd}/mainsail.service`
    }
}

export const clone = {
    system: async (config: schema) => {

    },
    klipper: async (config: schema) => {
        console.log('Cloning klipper')
        await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.klipper!.repo} --branch ${config.services.klipper!.branch} --depth 1`
    },
    moonraker: async (config: schema) => {
        console.log('Cloning moonraker')
        await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.moonraker!.repo} --branch ${config.services.moonraker!.branch} --depth 1`

    },
    fluidd: async (config: schema) => {
        console.log('Cloning mainsail')
        await $`mkdir -p ${config.install.base}/repos/mainsail && cd ${config.install.base}/repos/mainsail &&  wget ${config.services.mainsail!.repo}/releases/download/${config.services.mainsail!.tag}/mainsail.zip && unzip mainsail.zip && rm mainsail.zip`
    },
    mainsail: async (config: schema) => {
        console.log('Cloning fluidd')
        await $`mkdir -p ${config.install.base}/repos/fluidd && cd ${config.install.base}/repos/fluidd &&  wget ${config.services.fluidd!.repo}/releases/download/${config.services.fluidd!.tag}/fluidd.zip && unzip fluidd.zip && rm fluidd.zip`
    }
}

export const clean = {
    system: async (config: schema) => {

    },
    klipper: async (config: schema) => {
        console.log("Removing klipper repo:")
        await $`rm -rf ${config.install.base}/repos/klipper`

    },
    moonraker: async (config: schema) => {
        console.log("Removing moonraker repo:")
        await $`rm -rf ${config.install.base}/repos/moonraker`

    },
    fluidd: async (config: schema) => {
        console.log("Removing fluidd repo:")
        await $`rm -rf ${config.install.base}/repos/fluidd`
    },
    mainsail: async (config: schema) => {
        console.log("Removing mainsail repo:")
        await $`rm -rf ${config.install.base}/repos/mainsail`
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
        //Nothing to do. Manual configuration needed in the client to add all moonraker addresses.
    },
    mainsail: async (config: schema) => {
        //Nothing to do. Manual configuration needed in the client to add all moonraker addresses.
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
        //Nothing to do. Manual configuration needed in the client to add all moonraker addresses.
    },
    mainsail: async (config: schema) => {
        //Nothing to do. Manual configuration needed in the client to add all moonraker addresses.
    }
}