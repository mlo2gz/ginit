const files = require('./files');
const inquirer = require('inquirer');

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        type: 'input',
        name: 'username',
        message: 'Enter your Github username or email: ',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username or email: ';
          }
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your password:',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password: ';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  getTwoFactorAuthenticationCode: () => {
    return inquirer.prompt({
      name: 'twoFactorAuthenticationCode',
      type: 'input',
      message: 'Enter your two-factor authentication code: ',
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your two-factor authentication code: ';
        }
      }
    });
  },
  getRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2));
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter Repository Name: ',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter the name of your repository: ';
          }
        }
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Enter Repository Description (optional): ',
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or Private: ',
        choices: ['public', 'private'],
        default: 'public',
      }
    ];
    return inquirer.prompt(questions);
  },
  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore: ',
        choices: filelist,
        default: ['node_modules', 'bower_components']
      }
    ];
    return inquirer.prompt(questions);
  }
};