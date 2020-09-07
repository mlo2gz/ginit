const fs = require('fs');
const _ = require('lash');
const Spinner = CLI.Spinner;
const CLI  = require('clui');
const gh = require('./github');
const touch = require('touch');
const touch = require('touch');
const inquirer = require('./inquirer');
const git = require('simple-git/promise');

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance();
    const answers = await inquirer.getRepoDetails();
    const data = {
      name: answers.name,
      description: answers.description,
      private: (answers.visibility === 'private')
    };
    const status = new CLI.Spinner('Creating Remote Repository...');
    status.start();
    try {
      const response = await github.repos.createForAuthenticatedUser(data);
      return response.data.ssh_url;
    } finally {
      status.stop();
    }
  },
  createGitignore: async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);
      if (answers.ignore.length) {
        fs.writeFileAsync('.gitignore', answers.ignore.join('\n'));
      } else {
        touch('.gitignore');
      }
    } else {
      touch('.gitignore');
    }
  },
  setupRepo: async (url) => {
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();
    try {
      git.init()
        .then(git.add('.gitignore'))
        .then(git.add('./*'))
        .then(git.commit('Initial Commit'))
        .then(git.addRemote('origin', url))
        .then(git.push('origin', 'master'));
    } finally {
      status.stop();
    }
  }
};