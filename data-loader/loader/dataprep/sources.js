import * as fs from 'async-file';

async function get(tenant_name) {
    try {
      var tenant_name_lc = tenant_name.toLowerCase();
			const sourceFileName = __dirname + '/../../data/' + tenant_name_lc + '/dataprep/sources.js';
      var data = await fs.readFile(sourceFileName, 'utf8');
      var sources = JSON.parse(data);
      return sources;
    }
    catch (e) {
      console.log(e);
    }
}

export { get };
