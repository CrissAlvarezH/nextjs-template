#!/bin/bash
set -e

action=$1

if [ "$action" = "build" ]; then
  docker build --no-cache -t nextjs-template .

elif [ "$action" = "run" ]; then
  docker run --rm -p 3000:3000 nextjs-template

fi