
import * as fs from 'async-file';

async function get(tenant_name) {
    try {
      var tenant_name_lc = tenant_name.toLowerCase();
      var data = await fs.readFile(__dirname + '/../../data/' + tenant_name_lc + '/c360/clusters.json', 'utf8');
      var jsonData = JSON.parse(data);
      return jsonData;
    }
    catch (e) {
      console.log(e);
    }
}

export { get };
