import { schema } from "@schemas/main.schema";

export default (opts: schema, instance: string) => `# systemd service file for moonraker instance ${instance}
[Unit]
Description=API Server for Klipper instance ${instance}
Requires=network-online.target
After=network-online.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
User=${opts.install.user}
SupplementaryGroups=moonraker-admin
RemainAfterExit=yes
EnvironmentFile=${opts.install.base}/instances/${instance}/printer_data/systemd/moonraker.env
ExecStart=${opts.install.base}/instances/${instance}/moonraker-env/bin/python $MOONRAKER_ARGS
Restart=always
RestartSec=10`