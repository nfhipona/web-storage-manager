#! /bin/bash

git push && git push --tags && ./node_modules/.bin/babel src --out-dir lib && npm publish
