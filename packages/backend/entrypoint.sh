#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  yarn start:backend
else
  yarn dev:backend
fi
