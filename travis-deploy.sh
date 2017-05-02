#!/bin/bash
set -e

image="buzzn/metering-listener"
docker tag metering-listener "$image:$TRAVIS_TAG-$ARCH"
docker push "$image:$TRAVIS_TAG-$ARCH"
