#!/bin/sh
grep '"version"' package.json | sed -E 's/[^0-9]*([0-9.]+).*/\1/'
