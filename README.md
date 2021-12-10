# trigger-circleci-pipeline [![ci status][ci image]][ci url]
> A little utility for triggering CircleCI pipelines for a given branch with fallback to the default branch

## Install and use

```shell
$ npm i -D trigger-circleci-pipeline
# or use Yarn
$ yarn add -D trigger-circleci-pipeline
```

Set the CircleCI personal access token as an environment variable `CIRCLE_CI_API_TOKEN`

### Using one-time install

You can avoid adding this NPM package as a dev dependency and simply invoke it using `npx`

```shell
$ npx trigger-circleci-pipeline --org ... --project ...
```

If the workflow is successfully triggered, it will print the workflow build number and any other information returned by the CircleCI API. It will also print workflow URLs

```text
CircleCI pipeline number 125
{
  number: 125,
  state: 'pending',
  id: '4b9b35c7-d292-4af4-a993-81006e006474',
  created_at: '2021-09-02T14:40:42.447Z'
}
trigger pipeline on branch delay-ajax successfully
1 workflow(s) for pipeline 4b9b35c7-d292-4af4-a993-81006e006474
e2e https://app.circleci.com/pipelines/gh/bahmutov/todomvc-tests-circleci/125/workflows/b3877d79-6efc-4f5a-837a-faa4f31daff2
```

### Defaults

Trigger the pipeline with all defaults for CircleCI organization and project:

```
npx trigger-circleci-pipeline --org <org name> --project <project name>
# for example
npx trigger-circleci-pipeline --org bahmutov --project todomvc-tests-circleci
```

### Branch name

If you want to trigger the pipeline on a specific branch (with fallback to the default one)

```
npx trigger-circleci-pipeline --org <org name> --project <project name> --branch <branch name>
# for example
npx trigger-circleci-pipeline \
  --org bahmutov --project todomvc-tests-circleci --branch feature-x
```

### Pipeline parameters

You can pass pipeline parameters using a comma-separated string in `--parameters`

```
npx trigger-circleci-pipeline \
  --org <org name> --project <project name> --branch <branch name> \
  --parameters x=value,y=another-value
# for example
npx trigger-circleci-pipeline \
  --org bahmutov --project todomvc-tests-circleci --branch feature-x \
  --parameters TEST_BRANCH=feature-x,TEST_URL=https://test.com/feature-x
```

## Debugging

Run this utility with the environment variable `DEBUG=trigger-circleci-pipeline` to see verbose log messages.

## Demo

Run the [demo.sh](./demo.sh) to trigger a workflow build in the project [bahmutov/todomvc-tests-circleci](https://github.com/bahmutov/todomvc-tests-circleci) with results at [CircleCI](https://app.circleci.com/pipelines/github/bahmutov/todomvc-tests-circleci). Using [as-a](https://github.com/bahmutov/as-a) is recommended.

```shell
$ as-a circleci-user ./demo.sh
```

## Example projects

- [bahmutov/todomvc-no-tests-vercel](https://github.com/bahmutov/todomvc-no-tests-vercel)

## NPM module API

### triggerPipelineWithFallback

```js
const { triggerPipelineWithFallback } = require('trigger-circleci-pipeline')
triggerPipelineWithFallback({
  org: 'org name',
  project: 'project name',
  branchName: 'branch name', // optional
  parameters, // object with pipeline parameters
  circleApiToken,
})
```

## More information

See [CirlceCI pipeline API](https://circleci.com/docs/api/v2/#operation/triggerPipeline). Read the blog post [How to Keep Cypress Tests in Another Repo While Using CircleCI](https://glebbahmutov.com/blog/how-to-keep-cypress-tests-in-another-repo-with-circleci/).

## Small print

Author: Gleb Bahmutov &copy; 2021

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog/)
* [videos](https://www.youtube.com/glebbahmutov)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/trigger-circleci-pipeline/issues) on Github

## MIT License

Copyright (c) 2021 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[ci image]: https://github.com/bahmutov/trigger-circleci-pipeline/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/trigger-circleci-pipeline/actions
