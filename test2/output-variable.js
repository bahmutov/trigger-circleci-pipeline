// try to write GitHub Actions variable
if (process.env.CI && process.env.GITHUB_ACTION) {
  console.log('::set-output name=test2::ciao')
}
