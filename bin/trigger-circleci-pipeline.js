#!/usr/bin/env node
// @ts-check

const debug = require('debug')('trigger-circleci-pipeline')
const { triggerPipeline } = require('../src/trigger')
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

const triggerBranchWithFallback = () => {
  // test a specific pipeline ID
  // return Promise.resolve({
  //   number: 122,
  //   state: 'pending',
  //   id: '23e09136-2269-4a1b-8fe7-8ff5ab52c9af',
  //   created_at: '2021-09-02T14:12:52.544Z',
  // })

  console.log(
    'Trigger CircleCI pipeline for %s/%s',
    args['--org'],
    args['--project'],
  )
  return triggerPipeline(
    args['--org'],
    args['--project'],
    args['--branch'],
    parameters,
  ).then((triggeredResult) => {
    if (triggeredResult) {
      if (args['--branch']) {
        console.log(
          'trigger pipeline on branch %s successfully',
          args['--branch'],
        )
      } else {
        console.log('trigger pipeline successfully')
      }
      return triggeredResult
    }

    return triggerPipeline(args['--org'], args['--project'], null, parameters)
  })
}

triggerBranchWithFallback()
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
