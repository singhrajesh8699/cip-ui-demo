
import { RFV_SCORES } from '../data/sample/rfv_scorecard';

function getRFV(rfv_score)
{
  return RFV_SCORES[rfv_score] ? RFV_SCORES[rfv_score]['category'] : null;
}

function closeScript(db) {
  console.log('ALL DONE')
  db.close();
  process.exit();
}

export { getRFV, closeScript }