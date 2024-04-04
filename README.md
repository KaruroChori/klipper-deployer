> **Notice!** all this is very much work in progress.

I recently got a wyse 3040 to serve as a node on my network, and to handle multiple printers. However, it only comes with 2GB of ram and 8GB of flash storage.  
Hence, docker-based solutions like [portable-klipper](https://github.com/KaruroChori/portable-klipper) are not really feasible.  
I also tried [kiauh](https://github.com/dw-0/kiauh) but it does not really work.

- No good way to add multiple instances after the initial setup.
- It clones everything from the main repos for klipper and moonraker which takes forever and wastes a lot of storage.
- It installs way too many dependencies if you are not planning on compiling the c part of klipper directly on the host itself.

So I have been working on my own scripts to make the process more automatic and ergonomic from an automation pov.

# How to use it

## Requirements

- [ ] Base system should be Debian 12. Other systems might work as well. In general support for other systems will be added over time.
- [ ] The user you are running it from should be in your sudoers file.
- [ ] Install [bun](https://github.com/oven-sh/bun) on the target machine (on linux `curl -fsSL https://bun.sh/install | bash`).

## Configuration file

The main configuration file is in `./config/main.json`.  
If the file is missing, you can use the command `gen-config` to create a new default one.

### Backup folders

Backup folders for the previous configurations are automatically generated when changes are committed.  
Please, notice this does not include changes in the printer configuration, just changes in \*.service files.

## Setup examples

## NFS share
