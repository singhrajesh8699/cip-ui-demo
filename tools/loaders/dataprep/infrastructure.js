import * as fs from 'async-file';

async function get(tenant_name) {
    try {
      var tenant_name_lc = tenant_name.toLowerCase();
      var data = await fs.readFile(__dirname + '/../data/' + tenant_name_lc + '/dataprep/infrastructure.js', 'utf8');
      var infra = JSON.parse(data);
      return infra;
    }
    catch (e) {
      console.log(e);
    }
}

export { get };