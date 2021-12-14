// @ts-check
const got = require('got')
const debug = require('debug')('trigger-circleci-pipeline')

function getPipelineUrl(org, project) {
  const pipelineUrl = `https://circleci.com/api/v2/project/gh/${org}/${project}/pipeline`
  return pipelineUrl
}

/**
 * Triggers CircleCI pipeline run
 * @see https://circleci.com/docs/api/v2/#operation/triggerPipeline
 * @returns undefined if could not trigger the pipeline,
 * or an object with new pipeline parameters on success
 */
async function triggerPipeline(options = {}) {
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

  if (branchName) {
    // try the specific branch pipeline
    console.log('trying to trigger pipeline for branch "%s"', branchName)
  } else {
    console.log('triggering pipeline on default branch')
  }

  const pipelineUrl = getPipelineUrl(org, project)
  debug('pipeline url: %s', pipelineUrl)

  const json = {
    parameters,
  }
  // CircleCI rejects requests with "branch: null"
  if (branchName) {
    json.branch = branchName
  }

  try {
    // result of triggering a pipeline if successful
    // "id", "number", "state", "created_at"
    const result = await got
      // @ts-ignore
      .post(pipelineUrl, {
        headers: {
          'Circle-Token': circleApiToken,
        },
        json,
      })
      .json()

    if (typeof result.number === 'number') {
      console.log('CircleCI pipeline number %d', result.number)
      console.log(result)
      return result
    } else {
      // did not trigger the pipeline
      return
    }
  } catch (err) {
    if (branchName && err.response.statusCode === 400) {
      // the branch name is invalid, try the default branch
      console.error('Branch not found, trying the default branch')
      return
    }
    // any other error - stop it
    throw err
  }
}

module.exports = { triggerPipeline }
