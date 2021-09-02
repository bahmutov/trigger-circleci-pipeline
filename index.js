#!/usr/bin/env node
// @ts-check

const debug = require('debug')('trigger-circleci-pipeline')
const { triggerPipeline } = require('./src/trigger')

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

triggerPipeline(
  args['--org'],
  args['--project'],
  args['--branch'],
  parameters,
).then(
  (triggered) => {
    if (triggered) {
      if (args['--branch']) {
        console.log(
          'trigger pipeline on branch %s successfully',
          args['--branch'],
        )
      } else {
        console.log('trigger pipeline successfully')
      }
      return
    }

    return triggerPipeline(args['--org'], args['--project'], null, parameters)
  },
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
