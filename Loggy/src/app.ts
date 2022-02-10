import prompts from "prompts";
import chalk from "chalk";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';


(async () => {
    console.log(chalk.blueBright('Loggy!' + ' The log management tool'));
    // const response = await prompts({
    //     type: 'number',
    //     name: 'value',
    //     message: 'How old are you?',
    //     validate: value => value < 18 ? `Nightclub is 18+ only` : true
    // });

    // console.log(response); // => { value: 24 }




    const args = yargs(hideBin(process.argv))
        .command('serve [port]', 'start the server', (yargs) => {
            return yargs
                .positional('port', {
                    describe: 'port to bind on',
                    default: 5000
                })
        }, (argv) => {
            if (argv.verbose) console.info(`start server on :${argv.port}`)
            // serve(argv.port)
        })
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Run with verbose logging'
        })
        .argv
})();