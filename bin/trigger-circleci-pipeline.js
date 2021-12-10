#!/usr/bin/env node
// @ts-check

const debug = require('debug')('trigger-circleci-pipeline')
const { triggerPipelineWithFallback } = require('../src/index')
const { printWorkflows } = require('../src/print-workflows')

if (!process.env.CIRCLE_CI_API_TOKEN) {
  throw new Error('Missing CIRCLE_CI_API_TOKEN')
}

const arg = require('arg')
const args = arg({
  '--org': String, // CircleCI organization
  '--project': String, // CircleCI project
  '--branch': String, // [optional] pipeline branch name
  '--parameters': String, // [optional] pipeline parameters as a string

  // aliases
  '-o': '--org',
  '-p': '--project',
  '-b': '--branch',
})
debug('arguments %o', args)
if (!args['--org']) {
  console.error('Missing --org CircleCI organization name')
  process.exit(1)
}
if (!args['--project']) {
  console.error('Missing --project CircleCI project name')
  process.exit(1)
}

// assume --parameters is a comma-separated string
const parameters = {}
if (args['--parameters']) {
  const parts = args['--parameters'].split(',').map((s) => s.trim())
  parts.forEach((part) => {
    const [key, value] = part.split('=')
    parameters[key] = value
  })
}
debug('parsed parameters %o', parameters)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

console.log(
  'Trigger CircleCI pipeline for %s/%s',
  args['--org'],
  args['--project'],
)

triggerPipelineWithFallback({
  org: args['--org'],
  project: args['--project'],
  branchName: args['--branch'],
  parameters,
  circleApiToken: process.env.CIRCLE_CI_API_TOKEN,
})
  .then((triggeredResult) => {
    if (!triggeredResult) {
      // nothing to report, could not trigger the pipeline
      return
    }

    // wait for N seconds for the workflows to be created
    // on the CircleCI side, then ask for their URLs
    return delay(5000).then(() => printWorkflows(triggeredResult.id))
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
