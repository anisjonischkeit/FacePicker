const prompt = require('prompt')
const package = require('../package.json')
const fs = require('fs');
const execSync = require('child_process').execSync;

prompt.start()

var schema = {
    properties: {
        releaseType: {
            pattern: /^(patch|minor|major)$/,
            message: 'Release Type [patch | minor | major]',
            required: true
        }
    }
};

const assertCleanGit = () => {
    if (execSync("git symbolic-ref HEAD 2>/dev/null").toString() != "refs/heads/master\n") // on branch master
        throw "not on the master branch"
    if (execSync("git status --porcelain").toString() != "") // no uncommited changes
        throw "there are uncommited changes"
    if (execSync("git diff HEAD origin/master").toString() != "") //same commit as origin master
        throw "you are not on the same commit as origin master"
}

assertCleanGit()

prompt.get(schema, function (err, result) {
    if (err) { return onErr(err); }
    let version = package.version.split(".")

    let pos = 0
    switch (result.releaseType) {
        case "major":
            pos = 0
            break;
        case "minor":
            pos = 1
            break;
        case "patch":
            pos = 2
            break;
    }

    num = parseInt(version[pos])
    version[pos] = num + 1
    

    package.version = version.join(".")

    fs.writeFileSync('package.json', JSON.stringify(package, null, 4), 'utf8');
    
    execSync(`git add package.json`)
    execSync(`git commit -m "Release -- Version ${package.version}"`)
    execSync(`git push`)

    execSync(`git push --delete origin latest`)

    execSync(`git tag version-${package.version}`)
    execSync(`git tag -f latest`)
    execSync(`git push --tags`)

  })