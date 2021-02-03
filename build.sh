#!/bin/bash
git pull
docker-compose -f ./docker-compose.prod.yml build --force-rm
docker-compose -f docker-compose.prod.yml  up