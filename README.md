# BPConnect
Bordeau Plumbing's Office Management Application

## Overview
This is a web app build with VueJS and powered by NodeJS with a PostgreSQL database. It's responsible for tracking plumbing jobs and parts through multiple phases.

## Development
BPConnect is a containerized application and made to be ran with Docker during development and deployed with Kubernetes in production.

### System Requirements
Ensure that you have Docker and Docker-Compose installed on your system.

### Launching a Dev Environment
From the application's directory, use docker-compose to launch a development environment.
```
docker-compose -f build/dev/docker-compose.yaml up
```

This will launch a container for the database, api, and frontend.

### Accessing the Site
Go to [localhost:8080](http://localhost:8080) to access the site.
