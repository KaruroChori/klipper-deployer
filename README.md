> **Notice!** all this is very much work in progress; not all features are working, even when documented.

I recently got a wyse 3040 to serve as a node on my network, and to handle multiple printers.  
It is an atom-powered thin client, roughly the size of a raspberry pi; so, no surprise, it only comes with 2GB of RAM and 8GB of flash storage.  
Hence, docker-based solutions like [portable-klipper](https://github.com/KaruroChori/portable-klipper) are not really feasible.  
On paper [kiauh](https://github.com/dw-0/kiauh) offers a more lightweight approach, but it does not work for several reasons:

- There is no good way to add multiple instances after the initial setup.
- The base repositories for klipper and moonraker are fully cloned, leading to a signicant waste of time and storage during the initial setup.
- By default it installs the same dependencies specified on the original install scripts, but there is no point in having all those toolchains if at no point we are expecting to compile the firmware on the node itself.

For these reasons, I have been working on my own scripts to simplify the deployment process of klipper & friends on hardware with low end specs.  
A nice extra over a solution like _kiauh_ is how much easily it can be integrated in automated processes.

# How to use it

This package provides a single executable `klipper-deployer` once installed.  
Using it without parameters will show the different options which are available.

## System Requirements

- [ ] Base system should be Debian 12. Other systems might work as well. In general support for other systems will be added over time.
- [ ] The user you are running it from should be in your sudoers file.
- [ ] Install [bun](https://github.com/oven-sh/bun) on the target machine (on linux `curl -fsSL https://bun.sh/install | bash`).

## Initial installation

There are few ways to install this tool on your system. The easiest is to do it via bun.

```
bun install --global klipper-deployer
```

After that, you should be able to use `klipper-deployer` where you want.  
Go to the directory you want to use to host klipper & everything related; after that run

```
klipper-deployer init
```

or, if you want to perform the super quick automatic install

```
klipper-deployer all
```

### Backup folders

Backup folders for the previous configurations are automatically generated when changes are committed.  
Please, notice this does not include changes in the printer configuration, just changes in \*.service files.

## Customize the configuration

### NFS share

### Custom toolchains

### Running multiple instances
