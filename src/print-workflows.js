// @ts-check
const got = require('got')
const debug = require('debug')('trigger-circleci-pipeline')
const { writeFileSync } = require('fs')

const isGitHubActions = Boolean(process.env.CI && process.env.GITHUB_ACTION)
debug('running on GitHub Actions?', isGitHubActions)

function getUrl(pipelineId) {
  const pipelineUrl = `https://circleci.com/api/v2/pipeline/${pipelineId}/workflow`
  return pipelineUrl
}

function getWebAppUrl(w) {
  /*
    each workflow item fetched from a pipeline is something like
    {
      pipeline_id: '23e09136-2269-4a1b-8fe7-8ff5ab52c9af',
      id: 'a589baf0-41b8-47ef-a612-d2415d36772a',
      name: 'e2e',
      project_slug: 'gh/bahmutov/todomvc-tests-circleci',
      status: 'failed',
      started_by: '45ae8c6a-4686-4e71-a078-fb7a3b9d9e59',
      pipeline_number: 122,
      created_at: '2021-09-02T14:12:52Z',
      stopped_at: '2021-09-02T14:14:28Z'
    }
    we form the full URL one can open in the browser
  */
  const baseUrl = 'https://app.circleci.com/pipelines'
  return `${baseUrl}/${w.project_slug}/${w.pipeline_number}/workflows/${w.id}`
}

/**
 * Reports CircleCI pipeline workflows
 * @see https://circleci.com/docs/api/v2/#operation/listWorkflowsByPipelineId
 */
async function printWorkflows(pipelineId, circleCiApiToken) {
  if (typeof pipelineId !== 'string') {
    throw new Error('pipelineId must be a string')
  }

  circleCiApiToken = circleCiApiToken || process.env.CIRCLE_CI_API_TOKEN
  if (!circleCiApiToken) {
    throw new Error('Missing CIRCLE_CI_API_TOKEN')
  }

  const url = getUrl(pipelineId)
  debug('pipeline workflows url: %s', url)

  try {
    const result = await got
      // @ts-ignore
      .get(url, {
        headers: {
          'Circle-Token': circleCiApiToken,
        },
      })
      .json()

    const items = result.items
    if (!items || !items.length) {
      console.log('no workflows for pipeline %s', pipelineId)
      return
    }

    console.log('%d workflow(s) for pipeline %s', items.length, pipelineId)
    items.forEach((w) => {
      const url = getWebAppUrl(w)
      console.log('%s %s %s', w.name, w.status, url)

      if (isGitHubActions && items.length === 1) {
        // https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
        debug('setting the single workflow as GitHub Actions step output')
        console.log(`::set-output name=CircleCIWorkflowUrl::${url}`)
        if (process.env.GITHUB_STEP_SUMMARY) {
          const summary = `CircleCI workflow URL: ${url}\n`
          writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary, {
            flag: 'a+',
          })
        }
      }
    })
  } catch (err) {
    if (err.response.statusCode === 400) {
      console.error('Pipeline %s not found', pipelineId)
      return
    }
    // any other error - throw it
    throw err
  }
}

module.exports = { printWorkflows }

// @ts-ignore
if (!module.parent) {
  const pipelineId = process.argv[2]
  if (!pipelineId) {
    throw new Error('Missing pipelineId')
  }
  printWorkflows(pipelineId)
}
