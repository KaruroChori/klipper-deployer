#!/bin/env bun
import { $ } from "bun";

export const install_packages = async (opts: { toolchains: ('avr' | 'arm')[] }) => {
    // Update system package info
    console.log("Running apt-get update...")
    await $`sudo apt update`

    //Basic utilities
    console.log("Installing basic utilities...")
    await $`sudo apt install git wget curl unzip --yes`

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
}