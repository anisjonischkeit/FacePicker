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
        commitMessage: {
            required: true
        }
    }
};


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
    
    execSync(`git commit -m "${commitMessage}"`)
    execSync(`git tag version-${package.version}`)
    execSync(`git push`)
    execSync(`git push --tags`)
  })