import * as fs from 'fs';

function getRFV(rfv_score, tenantObj)
{
  var tenant_name_lc = tenantObj.name.toLowerCase();
  var data = fs.readFileSync(__dirname + '/../data/' + tenant_name_lc + '/c360/rfv_scorecard.js', 'utf8');
  var rfv_data = JSON.parse(data);
  var rfv_val = null;
  if (rfv_data[rfv_score]) {
    rfv_val = rfv_data[rfv_score]['category'];
  }
  return rfv_val;
}

export { getRFV }