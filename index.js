#!/usr/bin/env node
// @ts-check

const debug = require('debug')('trigger-circleci-pipeline')

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

const got = require('got')

const pipelineUrl = `https://circleci.com/api/v2/project/gh/${args['--org']}/${args['--project']}/pipeline`
debug('pipeline url: %s', pipelineUrl)

// https://circleci.com/docs/api/v2/#operation/triggerPipeline
async function triggerPipeline(branchName, parameters) {
  if (branchName) {
    // try the specific branch pipeline
    console.log('trying to trigger pipeline for branch "%s"', branchName)
  } else {
    console.log('triggering pipeline on default branch')
  }

  const json = {
    parameters,
  }
  // CircleCI rejects requests with "branch: null"
  if (branchName) {
    json.branch = branchName
  }

  try {
    const result = await got
      // @ts-ignore
      .post(pipelineUrl, {
        headers: {
          'Circle-Token': process.env.CIRCLE_CI_API_TOKEN,
        },
        json,
      })
      .json()

    if (typeof result.number === 'number') {
      console.log('CircleCI workflow number %d', result.number)
      console.log(result)
      return true
    } else {
      // did not trigger the pipeline
      return false
    }
  } catch (err) {
    if (branchName && err.response.statusCode === 400) {
      // the branch name is invalid, try the default branch
      console.error('Branch not found, trying the default branch')
      return false
    }
    // any other error - stop it
    throw err
  }
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

triggerPipeline(args['--branch'], parameters).then(
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

    return triggerPipeline(null, parameters)
  },
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
