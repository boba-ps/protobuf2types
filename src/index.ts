import { Command } from "commander";
import packageJson from "../package.json"
import * as pbts from '@pbts/core';
import { createWriteStream, readdirSync } from "fs";
import protobuf from "protobufjs";

const program = new Command();

(async () => {
program
  .name('protobuf2types')
  .description('Google Protobuffer file(s) to Typescript Types')
  .version(packageJson.version);

program.command('convert-directory')
  .description('Converts a directory with protobuffers to Typescript types in a single file')
  .argument('<directory>', 'directory with all protobufs')
  .argument('<outFile>', 'output file')
  .action((directory, outFile) => {
    const dir = readdirSync(directory);
    dir.forEach((file) => {
        const fDir = `${directory}${file}`
        const proto = protobuf.loadSync(fDir);
        const defs = pbts.parseProtoRoot(proto, { isDefinition: true});
        const stream = createWriteStream(outFile, {
            flags: 'a'
        })

        stream.write(defs);
        stream.close();
    })
  })
program.parse(process.argv);
})();
