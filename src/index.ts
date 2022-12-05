import commandExists from 'command-exists'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

type RunOption = {
  tag?: string
  targetDir?: string
  outputDir?: string
}

const getOption = (): RunOption => {
  const tag = core.getInput('tag')
  const targetDir = core.getInput('targetDir')
  const outputDir = core.getInput('outputDir')

  return {
    ...(tag ? { tag } : {}),
    ...(targetDir ? { targetDir } : {}),
    ...(outputDir ? { outputDir } : {}),
  }
}

const checkCommandExists = async (): Promise<null | string> => {
  return new Promise(r => {
    commandExists('pip', (er, e) => {
      if (e) {
        r(null)
      } else {
        r('pip')
      }
    })
  })
}

const installDbt2looker = () => {
  return exec.exec(`pip install dbt2looker`)
}

const runDbt2looker = (options) => {
  const base = ["dbt2looker"]

  const { tag, outputDir, targetDir } = options

  if (tag) {
    base.push(`--tag=${tag}`)
  }
  if (targetDir) {
    base.push(`--target-dir=${targetDir}`)
  }
  if (outputDir) {
    base.push(`--output-dir=${outputDir}`)
  }

  return exec.exec(base.join(' '))
}

const run = async () => {
  const ng = await checkCommandExists()
  if (ng) {
    core.setFailed(`command ${ng} does not exist`)
    return
  }

  await installDbt2looker()

  const option = getOption();

  await runDbt2looker(option)
}

run();
