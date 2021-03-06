#! /bin/bash

# trigger a new pipeline demo
DEBUG=trigger-circleci-pipeline as-a circleci-user node bin/trigger-circleci-pipeline \
  --org bahmutov --project todomvc-tests-circleci \
  --branch delay-ajax \
  --parameters TEST_BRANCH=delay-ajax,TEST_URL=https://todomvc-no-tests-vercel-86m2n6fxp-gleb-bahmutov.vercel.app
