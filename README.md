# trigger-circleci-pipeline [![ci status][ci image]][ci url]
> A little utility for triggering CircleCI pipelines for a given branch with fallback to the default branch

## Install and use

```shell
$ npm i -D trigger-circleci-pipeline
# or use Yarn
$ yarn add -D trigger-circleci-pipeline
```

Set the CircleCI personal access token as an environment variable `CIRCLE_CI_API_TOKEN`

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

## More information

See [CirlceCI pipeline API](https://circleci.com/docs/api/v2/#operation/triggerPipeline)

## Small print

Author: Gleb Bahmutov &copy; 2021

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog/)

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

[ci image]: https://github.com/bahmutov/trigger-circleci-pipeline/workflows/ci/badge.svg?branch=master
[ci url]: https://github.com/bahmutov/trigger-circleci-pipeline/actions
