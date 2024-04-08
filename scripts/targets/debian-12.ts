import { $ } from "bun";
import { schema } from "../../schemas/main.schema.ts"
import { existsSync } from "node:fs"

//TODO: Once new platforms will be supported, move portable code to @commons.

export const install_packages = (config: schema) => {
    return {
        system: async () => {
            // Update system package info
            console.log("Running apt-get update...")
            await $`sudo apt update`

            //Basic utilities
            console.log("Installing basic utilities...")
            await $`sudo apt install git wget curl unzip nfs-common --yes`
        },
        klipper: async () => {
            //Packages for python cffi
            let PKGLIST = ["python3", "virtualenv", "python3-dev", "libffi-dev", "build-essential"];
            //kconfig requirements
            PKGLIST.push('libncurses-dev')
            // hub-ctrl
            PKGLIST.push('libusb-dev') // ` //libusb-1.0`
            // AVR chip installation
            PKGLIST.push('avrdude')
            if (config.services.klipper?.arch.includes('all') || config.services.klipper?.arch.includes('avr')) {
                // AVR chip building
                PKGLIST.push('gcc-avr', 'binutils-avr', 'avr-libc')
            }
            // ARM chip installation
            PKGLIST.push('stm32flash', 'dfu-util')
            if (config.services.klipper?.arch.includes('all') || config.services.klipper?.arch.includes('arm32')) {
                // ARM chip  building
                PKGLIST.push('libnewlib-arm-none-eabi')
                PKGLIST.push('gcc-arm-none-eabi', 'binutils-arm-none-eabi')
            }
            // Install desired packages
            console.log("Installing the rest of the packages...")
            await $`sudo apt install ${PKGLIST} --yes`

            console.log("Updating python virtual environment...")

            // Create virtualenv if it doesn't already exist
            if (!existsSync(`${config.install.base}/klippy_env`)) {
                await $`virtualenv -p python3 ${config.install.base}/klippy_env`
            }
            //Install / update dependencies
            await $`${config.install.base}/klippy_env/bin/pip install -r ${config.install.base}/repos/klipper/scripts/klippy-requirements.txt`
        },
        moonraker: async () => {
            //TODO: Basically an alternative implementation for ./install-moonraker.sh split across make_intance and here.

            let PKGLIST = []
            PKGLIST.push('python3', 'python3-virtualenv', 'python3-dev', 'liblmdb-dev')
            PKGLIST.push('libopenjp2-7', 'libsodium-dev', 'zlib1g-dev', 'libjpeg-dev')
            PKGLIST.push('packagekit', 'wireless-tools', 'curl')

            console.log("Installing Moonraker Dependencies:")
            await $`sudo apt install ${PKGLIST} --yes`

            // Create virtualenv if it doesn't already exist
            if (!existsSync(`${config.install.base}/moonraker_env`)) {
                await $`virtualenv -p python3 ${config.install.base}/moonraker_env`
            }
            //Install / update dependencies
            await $`${config.install.base}/moonraker_env/bin/pip install -r ${config.install.base}/repos/moonraker/scripts/moonraker-requirements.txt`
            if (config.services.moonraker?.speedsup === true) {
                await $`${config.install.base}/moonraker_env/bin/pip install -r ${config.install.base}/repos/moonraker/scripts/moonraker-speedups.txt`
            }

        },
        fluidd: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}fluidd`
            const file = `${config.install.systemd}/${n}.service`

            console.log("Removing previous instance if present:")
            await $`sudo service ${`${config.install.prefix}-` ?? ''}fluidd stop || true`
            await $`sudo rm ${file}  || true`
            let PKGLIST = ["python3"];
            console.log("Installing Fluidd dependencies:")
            await $`sudo apt install ${PKGLIST} --yes`

            console.log("Generating service files:")
            await $`echo ${(await import('../../templates/fluidd.service')).default(config)} | sudo tee ${file}`

            await $`sudo systemctl enable ${n}.service`
            await $`sudo service ${n} start`

        },
        mainsail: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}mainsail`
            const file = `${config.install.systemd}/${n}.service`

            console.log("Removing previous instance if present:")
            await $`sudo service ${`${config.install.prefix}-` ?? ''}mainsail stop || true`
            await $`sudo rm ${file} || true`
            let PKGLIST = ["python3"];
            console.log("Installing mainsail dependencies:")
            await $`sudo apt install ${PKGLIST} --yes`

            console.log("Generating service files:")
            await $`echo ${(await import('../../templates/mainsail.service')).default(config)} | sudo tee ${file}`

            await $`sudo systemctl enable ${n}.service`
            await $`sudo service ${n} start`

        }
    }
}

export const uninstall_packages = (config: schema) => {
    return {
        system: async () => {

        },
        klipper: async () => {
            console.log("Removing klipper venv:")
            await $`rm -rf ${config.install.base}/klippy_env`

        },
        moonraker: async () => {
            console.log("Removing moonraker venv:")
            await $`rm -rf ${config.install.base}/moonraker_env`

        },
        fluidd: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}fluidd`
            const file = `${config.install.systemd}/${n}.service`

            console.log("Removing previous instance if present:")
            await $`sudo service ${n} stop || true`
            await $`sudo rm ${file}`
        },
        mainsail: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}mainsail`
            const file = `${config.install.systemd}/${n}.service`

            console.log("Removing previous instance if present:")
            await $`sudo service ${n} stop || true`
            await $`sudo rm ${file}`
        }
    }
}

export const clone = (config: schema) => {
    return {
        klipper: async () => {
            console.log('Cloning klipper')
            await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.klipper!.repo} --branch ${config.services.klipper!.branch} --depth 1`
        },
        moonraker: async () => {
            console.log('Cloning moonraker')
            await $`mkdir -p ${config.install.base}/repos/ && cd ${config.install.base}/repos/ &&  git clone ${config.services.moonraker!.repo} --branch ${config.services.moonraker!.branch} --depth 1`

        },
        fluidd: async () => {
            console.log('Cloning mainsail')
            await $`mkdir -p ${config.install.base}/repos/mainsail && cd ${config.install.base}/repos/mainsail &&  wget ${config.services.mainsail!.repo}/releases/download/${config.services.mainsail!.tag}/mainsail.zip && unzip mainsail.zip && rm mainsail.zip`
        },
        mainsail: async () => {
            console.log('Cloning fluidd')
            await $`mkdir -p ${config.install.base}/repos/fluidd && cd ${config.install.base}/repos/fluidd &&  wget ${config.services.fluidd!.repo}/releases/download/${config.services.fluidd!.tag}/fluidd.zip && unzip fluidd.zip && rm fluidd.zip`
        }
    }
}

export const pull = (config: schema) => {
    return {
        klipper: async () => {
            console.log('Pulling klipper')
            await $`cd ${config.install.base}/repos/ &&  git pull`
        },
        moonraker: async () => {
            console.log('Pulling moonraker')
            await $`cd ${config.install.base}/repos/ &&  git pull`
        }
    }
}

export const clean = (config: schema) => {
    return {
        system: async () => {

        },
        klipper: async () => {
            console.log("Removing klipper repo:")
            await $`rm -rf ${config.install.base}/repos/klipper`

        },
        moonraker: async () => {
            console.log("Removing moonraker repo:")
            await $`rm -rf ${config.install.base}/repos/moonraker`

        },
        fluidd: async () => {
            console.log("Removing fluidd repo:")
            await $`rm -rf ${config.install.base}/repos/fluidd`
        },
        mainsail: async () => {
            console.log("Removing mainsail repo:")
            await $`rm -rf ${config.install.base}/repos/mainsail`
        }
    }
}

//Code which creates the specific instance running
export const make_instance = (config: schema, name: string) => {
    if (config.instances[name] === undefined) { throw { code: 1, msg: `Instance ${name} not defined in the base file.` } }
    const hasFolder = existsSync(`${config.install.base}/instances/${name}`)
    if (hasFolder) {
        throw { code: 2, msg: `Ignoring instance ${name} as it was already constructed before.` }
    }
    return {
        system: async () => {
        },
        klipper: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}klipper-${name}`
            const file = `${config.install.systemd}/${n}.service`

            console.log("Generating directories:")
            await $`mkdir -p ${config.install.base}/instances/${name}/printer_data/logs/`;
            await $`mkdir -p ${config.install.base}/instances/${name}/printer_data/config/`;

            console.log("Generating service files:")

            await $`echo ${(await import('../../templates/klipper.service')).default(config, name)} | sudo tee ${file}`
            await $`sudo systemctl enable ${n}.service`
            await $`sudo service ${n} start`
        },
        moonraker: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}moonraker-${name}`
            const file = `${config.install.systemd}/${n}.service`

            console.log("Generating directories:")

            await $`mkdir -p ${config.install.base}/instances/${name}/printer_data/config`;
            await $`mkdir -p ${config.install.base}/instances/${name}/printer_data/logs`;
            await $`mkdir -p ${config.install.base}/instances/${name}/printer_data/systemd`;

            console.log("Generating moonraker.cfg:")

            await $`echo ${(await import('../../templates/moonraker.cfg')).default(config, name)} > ${config.install.base}/instances/${name}/printer_data/config/moonraker.conf`

            console.log("Generating moonraker.env:")

            await $`echo ${(await import('../../templates/moonraker.env')).default(config, name)} > ${config.install.base}/instances/${name}/printer_data/systemd/moonraker.env`

            await $`sudo groupadd -f moonraker-admin`

            console.log("Generating service files:")

            await $`echo ${(await import('../../templates/moonraker.service')).default(config, name)} | sudo tee ${file}`
            await $`sudo systemctl enable ${n}.service`
            await $`sudo service ${n} start`
        }
    }
}

//Code which creates the specific instance running
export const delete_instance = (config: schema, name: string) => {
    if (config.instances[name] === undefined) { throw { code: 1, msg: `Instance ${name} not defined in the base file.` } }
    const hasFolder = existsSync(`${config.install.base}/instances/${name}`)
    if (!hasFolder) {
        throw { code: 2, msg: `Ignoring instance ${name} as it has not been built.` }
    }
    return {
        system: async () => {
            await $`rm -rf ${config.install.base}/instances/${name}`
        },
        klipper: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}klipper-${name}`
            const file = `${config.install.systemd}/${n}.service`

            await $`sudo service ${n} stop`
            await $`sudo rm ${file}`
        },
        moonraker: async () => {
            const n = `${config.install.prefix ? `${config.install.prefix}-` : ''}moonraker-${name}`
            const file = `${config.install.systemd}/${n}.service`

            await $`sudo service ${n} stop`
            await $`sudo rm ${file}`
        }
    }
}

export const start = (config: schema) => {
    return {
        system: async () => {
            if (config.services.mainsail?.enabled === true) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}mainsail start`
            }
            if (config.services.fluidd?.enabled === true) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}fluidd start`
            }
            if (config.services.moonraker?.enabled === true) for (const key of Object.keys(config.instances)) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}moonraker-${key} start`
            }
            if (config.services.klipper?.enabled === true) for (const key of Object.keys(config.instances)) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}klipper-${key} start`
            }
        }
    }
}
export const stop = (config: schema) => {
    return {
        system: async () => {
            if (config.services.mainsail?.enabled === true) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}mainsail stop`
            }
            if (config.services.fluidd?.enabled === true) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}fluidd stop`
            }
            if (config.services.moonraker?.enabled === true) for (const key of Object.keys(config.instances)) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}moonraker-${key} stop`
            }
            if (config.services.klipper?.enabled === true) for (const key of Object.keys(config.instances)) {
                await $`sudo service ${config.install.prefix ? `${config.install.prefix}-` : ''}klipper-${key} stop`
            }
        }
    }
}