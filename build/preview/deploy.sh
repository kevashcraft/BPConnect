#!/bin/bash

if [ -z $1 ]; then
  site=agency-reviews.com
else
  site=$1
fi

API_SERVER=http://agency-reviews.com:3000

docker build -t gcr.io/agency-reviews/site:latest -f build/prod/Dockerfile-site --build-arg API_SERVER=$API_SERVER .
docker build -t gcr.io/agency-reviews/api:latest -f build/prod/Dockerfile-api .
docker build -t gcr.io/agency-reviews/postgres:latest -f build/prod/Dockerfile-postgres .

gcloud docker -- push gcr.io/agency-reviews/site:latest
gcloud docker -- push gcr.io/agency-reviews/api:latest
gcloud docker -- push gcr.io/agency-reviews/postgres:latest

ssh -T $site '
docker run -t --rm --net=host -v $HOME/.config:/root/.config -v /var/run/docker.sock:/var/run/docker.sock google/cloud-sdk gcloud \
  docker -- pull gcr.io/agency-reviews/site:latest

docker run -t --rm --net=host -v $HOME/.config:/root/.config -v /var/run/docker.sock:/var/run/docker.sock google/cloud-sdk gcloud \
  docker -- pull gcr.io/agency-reviews/api:latest

docker run -t --rm --net=host -v $HOME/.config:/root/.config -v /var/run/docker.sock:/var/run/docker.sock google/cloud-sdk gcloud \
  docker -- pull gcr.io/agency-reviews/postgres:latest

sudo systemctl restart agency-reviews
'
