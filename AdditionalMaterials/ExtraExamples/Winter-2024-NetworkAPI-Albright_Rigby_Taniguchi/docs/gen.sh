#!/usr/bin/env bash

# This shell script generates the documentation with jsdoc

jsdoc -c conf.json -r ../public/multiplayer -R README.md -u tutorial
