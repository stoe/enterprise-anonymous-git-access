#!/usr/bin/env node
'use strict';

const versions = ['2.14', '2.15', '2.16', '2.17'];
const latestVersion = versions[versions.length - 1];

const chalk = require('chalk');
const meow = require('meow');

const cli = meow(
  `
  ${chalk.bold('Usage')}
    $ ./index <organization> <url> <token>

  ${chalk.bold('Options')}
    --disable, -d   Disable anonymous access ${chalk.dim.bold('(default: false)')}
    --ghe-version   Set the GitHub Enterprise Server version ${chalk.dim.bold(`(default: ${latestVersion})`)}
                    supported versions: ${versions.join(', ')}

  ${chalk.bold('Examples')}
    $ ./index acme-inc github.acme.com aaaa0000bbbb1111cccc2222dddd4444eeee5555
    $ ./index acme-inc github.acme.com aaaa0000bbbb1111cccc2222dddd4444eeee5555 --disable
    $ ./index acme-inc github.acme.com aaaa0000bbbb1111cccc2222dddd4444eeee5555 --ghe-version ${latestVersion}
`,
  {
    flags: {
      disable: {
        type: 'boolean',
        default: false,
        alias: 'd'
      },
      'ghe-version': {
        type: 'string',
        default: '2.17'
      }
    }
  }
);

const [owner, uri, auth] = cli.input;

const baseUrl = `https://${uri}/api/v3`;
const {disable, gheVersion} = cli.flags;

if (!(owner && uri && auth) || versions.indexOf(gheVersion) < 0) {
  cli.showHelp(2);
}

const Octokit = require('@octokit/rest').plugin(require(`@octokit/plugin-enterprise-rest/ghe-${gheVersion}`));
const octokit = new Octokit({
  baseUrl,
  auth,
  previews: ['x-ray-preview']
});

const options = octokit.repos.listForOrg.endpoint.merge({
  org: owner,
  type: 'public'
});

octokit
  .paginate(options)
  .then(repositories => {
    for (const repository of repositories) {
      const repo = repository.name;
      const slug = chalk.bold(`${owner}/${repo}`);

      octokit.repos
        .update({
          owner,
          repo,
          name: repo,
          // eslint-disable-next-line camelcase
          anonymous_access_enabled: !disable
        })
        .then(response => {
          if (response && response.status === 200) {
            console.log(
              `Anonymous Git read access ${disable ? chalk.red('disabled') : chalk.green('enabled')} for ${slug}`
            );
          } else {
            console.log(chalk.red(`Failed for ${slug}`));
          }
        })
        .catch(error => {
          console.error(`${chalk.red(`Failed for ${slug}`)}
  ${error.message}
  ${error.documentation_url}
`);
        });
    }
  })
  .catch(error => {
    console.error(`${chalk.red(`Getting repositories for organization ${chalk.bold(owner)} failed`)}
  ${error.message} (${error.status})
  ${error.documentation_url || ''}
`);
  });
