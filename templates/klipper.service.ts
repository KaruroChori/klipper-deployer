export default ({ }) => `#Systemd service file for klipper
[Unit]
Description=Starts klipper on startup
After=network.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
User=checkroom
RemainAfterExit=yes
ExecStart=/home/checkroom/klippy-env/bin/python /home/checkroom/klipper/klippy/klippy.py /home/checkroom/printer_data/config/printer.cfg -l /home/checkroom/printer_data/logs/klippy.log -a /tmp/klippy_uds
Restart=always
RestartSec=10`