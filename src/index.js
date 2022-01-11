// @ts-check

const debug = require('debug')('trigger-circleci-pipeline')
const { triggerPipeline } = require('./trigger')
const { printWorkflows } = require('./print-workflows')

const triggerPipelineWithFallback = (options = {}) => {
  // test a specific pipeline ID
  // return Promise.resolve({
  //   number: 122,
  //   state: 'pending',
  //   id: '23e09136-2269-4a1b-8fe7-8ff5ab52c9af',
  //   created_at: '2021-09-02T14:12:52.544Z',
  // })
  const { org, project, branchName, parameters, circleApiToken } = options
  if (!org) {
    throw new Error('Missing org')
  }
  if (!project) {
    throw new Error('Missing project')
  }
  if (!circleApiToken) {
    throw new Error('Missing circleApiToken')
  }

  debug('parameters %o', { org, project, branchName, parameters })

  debug('Trigger CircleCI pipeline for %s/%s', org, project)
  return triggerPipeline(options).then((triggeredResult) => {
    if (triggeredResult) {
      if (branchName) {
        console.log('trigger pipeline on branch %s successfully', branchName)
      } else {
        console.log('trigger pipeline successfully')
      }
      return triggeredResult
    }

    const optionsWithoutBranch = { ...options, branchName: null }
    return triggerPipeline(optionsWithoutBranch)
  })
}

function maybeNumber(s) {
  if (s === '') {
    return ''
  }

  const n = Number(s)
  if (isNaN(n)) {
    return s
  }
  return n
}

function parseParams(s) {
  const parameters = {}
  if (!s) {
    return parameters
  }
  const parts = s.split(',').map((s) => s.trim())
  parts.forEach((part) => {
    const [key, value] = part.split('=')
    parameters[key] = maybeNumber(value)
  })
  return parameters
}

module.exports = {
  triggerPipelineWithFallback,
  triggerPipeline,
  printWorkflows,
  parseParams,
}
