import { schema } from "../schemas/main.schema";

/*
TODO:
- Make fluidd config conditional
- Avoid cors * (?)
*/

export default (opts: schema, instance: string) => `# Moonraker Configuration File

[server]
host: 0.0.0.0
port: ${opts.instances[instance].moonraker.port}
# Make sure the klippy_uds_address is correct.  It is initialized
# to the default address.
klippy_uds_address: /tmp/klippy_uds_${`${opts.install.prefix}_` ?? ''}${instance}

[file_manager]
# cancel object preprocessing - set to True to enable; leave disabled when running on a low-powered device (e.g. Pi Zero)
enable_object_processing: True

[data_store]
temperature_store_size: 600
gcode_store_size: 1000

[authorization]
force_logins: false

cors_domains:
  *.local
  *.lan
  *://localhost
  *://app.fluidd.xyz
  *

trusted_clients:
  10.0.0.0/8
  127.0.0.0/8
  169.254.0.0/16
  172.16.0.0/12
  192.168.0.0/16
  FE80::/10
  ::1/128

[history]


[update_manager]
enable_auto_refresh: True

[announcements]
subscriptions:
  fluidd
${(opts.services.fluidd?.enabled && opts.services.fluidd?.updatable) ?
    `[update_manager fluidd]
type: web
repo: ${opts.services.fluidd?.repo}
path: ${opts.install.base}/repos/fluidd
`: ''}
${(opts.services.mainsail?.enabled && opts.services.mainsail?.updatable) ?
    `[update_manager mainsail]
type: web
repo: ${opts.services.mainsail?.repo}
path: ${opts.install.base}/repos/mainsail
`: ''}
[machine]
provider: systemd_dbus
`