#!/bin/bash

if [ -z $1 ]; then
  site=agency-reviews.com
else
  site=$1
fi

scp build/preview/agency-reviews.service $site:
scp build/preview/docker-compose.yaml $site:

ssh $site "
# docker-config
rm -rf config
mkdir config
mv docker-compose.yaml config/

# systemd service
sudo mv agency-reviews.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable agency-reviews
"
