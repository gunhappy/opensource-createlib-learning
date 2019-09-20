const makeDir = require('make-dir')
const execa = require('execa')
const ora = require('ora')
const cliProgress = require('cli-progress')
const fs = require('fs').promises
const { template } = require('lodash')

async function initProject(target) {
    const path = makeDir.sync(target)
    const spinner = ora('Initialize project').start()
    const result = await execa.command('npm init -y', {
        cwd: path,
    })
    spinner.stopAndPersist({
        text: `${target} is initialized ~`
    })
    const listToInstall = ['typescript', 'rollup']
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
    bar.start(listToInstall.length, 0)
    let i = 0
    for (item of listToInstall) {
        await execa.command(`npm install ${item}`, {
            cwd: path,
        })
        bar.update(++i)
    }
    bar.stop()
    fs.writeFile(`${path}/xxx.js`, 'xxx')
}

initProject('new-folder')

const lintStaged = template(`
{
    "<%= extension %>": [
      "prettier --write",
      "tslint --fix", 
      "git add"
    ]
  }
`)

console.log(lintStaged({
    extension: '*.ts'
}))
