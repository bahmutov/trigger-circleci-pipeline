const ghCore = require('@actions/core')

// try to write GitHub Actions variable
if (process.env.CI && process.env.GITHUB_ACTION) {
  ghCore.setOutput('test2', 'ciao')
}
