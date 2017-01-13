const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

class Koa2SeedGenerator extends Generator {
    prompting() {

        this.log(yosay(
            `Welcome to the extraordinary ${chalk.red('generator-koa2-seed')} generator!`
        ));

        const prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'Please input project name (koa2-project):',
                default: 'koa2-project'
            },
            {
                type: 'input',
                name: 'userName',
                message: 'Please input your name:'
            },
            {
                type: 'input',
                name: 'email',
                message: 'Please input your email:'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Please input project description:'
            },
            {
                version: 'input',
                name: 'version',
                message: 'Please input project version (0.1.0)',
                default: '0.1.0'
            }
        ];

        return this.prompt(prompts).then((props) => {
            this.props = props;
        });
    }

    default() {
        if (path.basename(this.destinationPath()) !== this.props.projectName) {
            this.log(
                `Your generator must be inside a folder named ${this.props.projectName}
                I'll automatically create this folder.
                `
            );

            mkdirp.sync(this.props.projectName);
            this.destinationRoot(this.destinationPath(this.props.projectName));
        }
    }

    writing() {
        this.fs.copy(
            this.templatePath('src'),
            this.destinationPath('src')
        );

        this.fs.copy(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc')
        );

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                projectName: this.props.projectName,
                userName: this.props.userName,
                email: this.props.email,
                description: this.props.description,
                version: this.props.version
            }
        );
    }

    install() {
        this.installDependencies({bower: false});
    }
}

module.exports = Koa2SeedGenerator;
