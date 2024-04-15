> [!CAUTION]
> This software is now in beta, but it is still a work in progress.  
> Most of the documented features are now working, yet you should expect the cli interface and the configuration schema to be broken with new releases.

# What is this?

A command line tool which allows to configure multi-printer klipper hosts within the same system. You provide a configuration file (or use one of those distributed along this tool) and _klipper deployer_ does the rest.  
It is not just [klipper](https://www.klipper3d.org/) alone! You can also deploy [moonraker](https://moonraker.readthedocs.io/en/latest/), [fluidd](https://docs.fluidd.xyz/) and [mainsail](https://docs.mainsail.xyz/). It is also possible to apply patches to klipper and moonraker as part of the build process.

This tool is written in typescript, and should be fully portable between different architectures.

## But why?

I recently got a [wyse 3040](https://www.dell.com/support/manuals/de-de/wyse-3040-thin-client/3040_ug/system) to serve as a node on my network, and to handle multiple printers/cnc stuff.  
It is an atom-based thin-client, roughly the size of a raspberry pi; so, no surprise, it only comes with 2GB of RAM and 8GB of flash storage.  
Using one for each printer would just be very wasteful, but due to its limited specs, a docker-based solution like [portable-klipper](https://github.com/KaruroChori/portable-klipper) is not really feasible.

## Don't we have KIAUH already?

On paper [kiauh](https://github.com/dw-0/kiauh) offers a more lightweight approach compared to a dockerized solution, but it would not work for several reasons:

- There is no easy way to add multiple instances after the initial setup.
- The base repositories for klipper and moonraker are fully cloned, leading to a significant waste of time and storage during the initial setup. Storage I just don't have on a Wyse 3040.
- By default, it installs the same dependencies as they are specified on the original installation scripts. Still, there is no point in having all those toolchains if we only need to compile firmware for some architectures, or if that is offloaded to a different and more powerful machine.

For these reasons, I have been working on my own scripts to simplify the deployment process of klipper & friends on hardware with low-end specs.  
A nice extra over a solution like _kiauh_ is how much more easily it can be integrated in automated processes, since it is all based on configuration files and few commands at best.

# How to use it

This package provides a single executable `klipper-deployer` once installed on your system.  
Calling it from your shell will display all the options available, but please read through this documentation before.

## System Requirements

Before using it, you have to make sure your system fulfills some requirements:

- [ ] Your system should be Debian 12. Other derived systems might work as well as long as packet names are the same.
- [ ] The user you are running it from must be in your [sudoers file](https://askubuntu.com/questions/7477/how-can-i-add-a-user-as-a-new-sudoer-using-the-command-line).
- [ ] Install [bun](https://github.com/oven-sh/bun) on the target machine (on linux `curl -fsSL https://bun.sh/install | bash` if you are not worried of piping bash). This script is written in typescript to keep my sanity.

In general, support for more systems will be added over time.

## Initial installation

There are few ways to install this tool on your system. The easiest is to do it via bun.

```
bun install --global git://github.com/KaruroChori/klipper-deployer.git#beta-1.2
```

After that, you should be able to use `klipper-deployer` where you want.  
Go to the directory you want to use to host klipper & everything related.

You now have two options: either you use one of the quick presets, or you perform the process manually.

### Quick preset

Typing `klipper-deployer presets` will give you a list of presets available.  
Select the one you want, and type `klipper-deployer preset name` to have everything automatically installed and running.  
Check the [documentation]() too see which presets are shipped with your version of _klipper-deployer_.

You should still check the supported commands in order to further apply changes to your current configuration.

### Custom config

First, start with

```
klipper-deployer init
```

> [!TIP]
> In most cases you don't want separate independent configurations, but many instances within the same configuration.  
> Still, you can run this script on multiple folders to have independent configurations not sharing the same global services and venvs.  
> However, take care you are not introducing collisions in instance names by setting different prefixes in the config file.  
> Also, make sure that you specify different ports.

An initial config file will be generated if not already present, or the one you wrote will be expanded to express defaults for most of the additional field you did not write.  
You can manually inspect it in `/config/main.json`. The subcommand `edit-config` is a handy shortcut.  
There are few helpers like `add-instance` and `clean-instance <id>` to further edit it.

Once you are happy with your file, you can run these commands in sequence

```
klipper-deployer commit     #To save the current config file as current.
klipper-deployer clone      #To clone all repos.
klipper-deployer install    #To install all deps for your repos & generate venvs.
klipper-deployer apply      #To add instances based on your configuration.
klipper-deployer start      #To start all global and instance-based services.
```

## Customize the configuration

TBW

### Patches

There is a [collection](./docs/patches.md) of curated patches for both klipper and moonraker.  
You can specify which one you want as an array in the property `patches` while configuring the two services.

### NFS share

TBW

### Custom toolchains

TBW
