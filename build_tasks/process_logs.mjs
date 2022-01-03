import Alpine from 'alpine';
import fg from 'fast-glob';
import fs from 'fs-plus';
import * as zlib from 'zlib';

import JSDB from '@small-tech/jsdb';

const LogDir = "~/Dropbox/logs/randomgeekery.org";

function findLogfiles(logDir) {
  const normalizedLogDir = fs.normalize(logDir);
  return fg.sync(`${normalizedLogDir}/**/access*.gz`);
};

function loadLogEntries(logFile, alpine) {
  console.log(`Loading log entries from ${logFile}...`)
  const buffer = fs.readFileSync(logFile);
  const lines = zlib.gunzipSync(buffer).toString().split('\n');

  return lines
    .filter((line) => line.length > 0)
    .map((line) => alpine.parseLine(line));
}

async function main() {
  const alpine = new Alpine();
  const db = JSDB.open('db');

  // if (db.logEntries) {
  //   await db.logEntries.delete();
  // }
  // const logFiles = findLogfiles(LogDir);
  // db.logEntries = logFiles.map((logFile) => loadLogEntries(logFile, alpine)).flat();

  console.log("Done");
  const entries = db.logEntries;
  const entryCount = entries.length;
  console.log(`Entries: ${entryCount}`);
}

main();