"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk_1.default.blueBright('Loggy!' + ' The log management tool'));
    // const response = await prompts({
    //     type: 'number',
    //     name: 'value',
    //     message: 'How old are you?',
    //     validate: value => value < 18 ? `Nightclub is 18+ only` : true
    // });
    // console.log(response); // => { value: 24 }
    const args = yargs_1.default(helpers_1.hideBin(process.argv))
        .command('serve [port]', 'start the server', (yargs) => {
        return yargs
            .positional('port', {
            describe: 'port to bind on',
            default: 5000
        });
    }, (argv) => {
        if (argv.verbose)
            console.info(`start server on :${argv.port}`);
        // serve(argv.port)
    })
        .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
        .argv;
}))();
//# sourceMappingURL=app.js.map