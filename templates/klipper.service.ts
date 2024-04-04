import { schema } from "@schemas/main.schema";

export default (opts: schema, instance: string) => `#Systemd service file for klipper instance ${instance}
[Unit]
Description=Starts klipper on startup
After=network.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
User=${opts.install.user}
RemainAfterExit=yes
ExecStart=${opts.install.base}/klippy-env/bin/python ${opts.install.base}/repos/klipper/klippy/klippy.py ${opts.install.base}/instances/${instance}/printer_data/config/printer.cfg -l ${opts.install.base}/instances/${instance}/printer_data/logs/klippy.log -a /tmp/klippy_uds_${instance}
Restart=always
RestartSec=10`