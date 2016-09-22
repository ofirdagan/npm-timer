const fs = require('fs');

const DB_FILENAME = '.npmstats';
class FileUtils {
  constructor() {
    this.hasStats = false;
  }

  readStats(){
    let stats;
    try {
      fs.accessSync(DB_FILENAME, fs.F_OK);
      this.hasStats = true;
    } catch (e) {
      fs.writeFileSync(DB_FILENAME, JSON.stringify({averageTime:0, installCount:0}));
    }
    try {
      stats = JSON.parse(fs.readFileSync('.npmstats').toString());
    } catch (e) {
      console.log(`error parsing npm stats. consider deleting ${DB_FILENAME} ${e}`);
    }
    return stats;
  }

  writeStats(stats) {
    fs.writeFile(DB_FILENAME, JSON.stringify(stats));
  }

  isHasStats () {
    return this.hasStats;
  }
}

module.exports = new FileUtils();
