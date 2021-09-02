// @ts-check
const got = require('got')
const debug = require('debug')('trigger-circleci-pipeline')

function getPipelineUrl(pipelineId) {
  const pipelineUrl = `https://circleci.com/api/v2/pipeline/${pipelineId}`
  return pipelineUrl
}

/**
 * Reports CircleCI pipeline information
 * @see https://circleci.com/docs/api/v2/#operation/getPipelineById
 */
async function printPipeline(pipelineId) {
  if (typeof pipelineId !== 'string') {
    throw new Error('pipelineId must be a string')
  }

  if (!process.env.CIRCLE_CI_API_TOKEN) {
    throw new Error('Missing CIRCLE_CI_API_TOKEN')
  }

  const pipelineUrl = getPipelineUrl(pipelineId)
  debug('pipeline url: %s', pipelineUrl)

  try {
    const result = await got
      // @ts-ignore
      .get(pipelineUrl, {
        headers: {
          'Circle-Token': process.env.CIRCLE_CI_API_TOKEN,
        },
      })
      .json()

    console.log(result)
  } catch (err) {
    if (err.response.statusCode === 400) {
      console.error('Pipeline %s not found', pipelineId)
      return
    }
    // any other error - throw it
    throw err
  }
}

module.exports = { printPipeline }
