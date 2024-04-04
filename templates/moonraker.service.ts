import { schema } from "@schemas/main.schema";

export default (opts: schema) => `# systemd service file for moonraker
[Unit]
Description=API Server for Klipper SV1
Requires=network-online.target
After=network-online.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
User=checkroom
SupplementaryGroups=moonraker-admin
RemainAfterExit=yes
EnvironmentFile=/home/checkroom/printer_data/systemd/moonraker.env
ExecStart=/home/checkroom/moonraker-env/bin/python $MOONRAKER_ARGS
Restart=always
RestartSec=10`