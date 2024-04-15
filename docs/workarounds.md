The current build system of klipper 0.12 is a bit broken for some platforms:

- Current master in klipper does not support modern versions of newlib shipped with debian 12, arch etc. This issue is documented [here](https://klipper.discourse.group/t/link-error-with-newlib-4-3-0-on-armv7/6820) and there is a patch for that.
- Most modern distributions are shipping a version of avr-gcc so old that compiling the firmware for Arduino 1 boards and clones do not work. A more modern toolchain is needed like [this one](https://blog.zakkemble.net/avr-gcc-builds/)
