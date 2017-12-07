
import fs from 'fs';

function setup() {
  console.log("Creating uploads directory\n");
  if (!fs.existsSync('uploads/')){
    fs.mkdirSync('uploads/');
  }

  console.log("Copying logo file for tenants\n");

  // Tenant1
  fs.createReadStream('tmp_uploads/tenant1.png')
    .pipe(fs.createWriteStream('uploads/tenant1.png'));
  fs.createReadStream('tmp_uploads/tenant1.jpg')
    .pipe(fs.createWriteStream('uploads/tenant1.jpg'));
  fs.createReadStream('tmp_uploads/tenant1_da1.jpg')
    .pipe(fs.createWriteStream('uploads/tenant1_da1.jpg'));

  // Tenant2
  fs.createReadStream('tmp_uploads/tenant2.png')
    .pipe(fs.createWriteStream('uploads/tenant2.png'));
  fs.createReadStream('tmp_uploads/tenant2.jpg')
    .pipe(fs.createWriteStream('uploads/tenant2.jpg'));
  fs.createReadStream('tmp_uploads/tenant2_ma1.jpg')
    .pipe(fs.createWriteStream('uploads/tenant2_ma1.jpg'));

  fs.createReadStream('tmp_uploads/staples.png')
    .pipe(fs.createWriteStream('uploads/staples.png'));
  fs.createReadStream('tmp_uploads/keurig.png')
    .pipe(fs.createWriteStream('uploads/keurig.png'));

  fs.createReadStream('tmp_uploads/rajeev.png')
    .pipe(fs.createWriteStream('uploads/rajeev.png'));
  fs.createReadStream('tmp_uploads/vinod.png')
    .pipe(fs.createWriteStream('uploads/vinod.png'));

  fs.createReadStream('tmp_uploads/staples_ma.jpg')
    .pipe(fs.createWriteStream('uploads/staples_ma.jpg'));
  fs.createReadStream('tmp_uploads/staples_da.jpg')
    .pipe(fs.createWriteStream('uploads/staples_da.jpg'));

  fs.createReadStream('tmp_uploads/keurig_ma.jpg')
    .pipe(fs.createWriteStream('uploads/keurig_ma.jpg'));
  fs.createReadStream('tmp_uploads/keurig_da.jpg')
    .pipe(fs.createWriteStream('uploads/keurig_da.jpg'));

  fs.createReadStream('tmp_uploads/venn.jpg')
    .pipe(fs.createWriteStream('uploads/venn.jpg'));
  fs.createReadStream('tmp_uploads/bubble1.png')
    .pipe(fs.createWriteStream('uploads/bubble1.png'));
  fs.createReadStream('tmp_uploads/bubble2.png')
    .pipe(fs.createWriteStream('uploads/bubble2.png'));
  fs.createReadStream('tmp_uploads/empty_nesters.jpeg')
    .pipe(fs.createWriteStream('uploads/empty_nesters.jpeg'));
  fs.createReadStream('tmp_uploads/momnbaby.jpeg')
    .pipe(fs.createWriteStream('uploads/momnbaby.jpeg'));
  fs.createReadStream('tmp_uploads/young_singles.jpeg')
    .pipe(fs.createWriteStream('uploads/young_singles.jpeg'));
  fs.createReadStream('tmp_uploads/young_couples.jpeg')
    .pipe(fs.createWriteStream('uploads/young_couples.jpeg'));

  fs.createReadStream('tmp_uploads/rfv_leastval.jpg')
    .pipe(fs.createWriteStream('uploads/rfv_leastval.jpg'));
  fs.createReadStream('tmp_uploads/rfv_mostval.jpg')
    .pipe(fs.createWriteStream('uploads/rfv_mostval.jpg'));

  fs.createReadStream('tmp_uploads/scheme_lifestage_small.jpg')
    .pipe(fs.createWriteStream('uploads/scheme_lifestage_small.jpg'));
   fs.createReadStream('tmp_uploads/scheme_potential_small.jpg')
    .pipe(fs.createWriteStream('uploads/scheme_potential_small.jpg'));
  fs.createReadStream('tmp_uploads/scheme_rfv_small.png')
    .pipe(fs.createWriteStream('uploads/scheme_rfv_small.png'));
  fs.createReadStream('tmp_uploads/scheme_missions_small.png')
    .pipe(fs.createWriteStream('uploads/scheme_missions_small.png'));
  fs.createReadStream('tmp_uploads/scheme_lifestyle_small.jpg')
    .pipe(fs.createWriteStream('uploads/scheme_lifestyle_small.jpg'));
  fs.createReadStream('tmp_uploads/mombaby.jpg')
    .pipe(fs.createWriteStream('uploads/mombaby.jpg'));
  fs.createReadStream('tmp_uploads/enthusiats.jpg')
    .pipe(fs.createWriteStream('uploads/enthusiats.jpg'));
  fs.createReadStream('tmp_uploads/vip.jpg')
    .pipe(fs.createWriteStream('uploads/vip.jpg'));
  fs.createReadStream('tmp_uploads/matures.jpg')
    .pipe(fs.createWriteStream('uploads/matures.jpg'));

  fs.createReadStream('tmp_uploads/dashboard_young_single.png')
    .pipe(fs.createWriteStream('uploads/dashboard_young_single.png'));
  fs.createReadStream('tmp_uploads/dashboard_young_couples.png')
    .pipe(fs.createWriteStream('uploads/dashboard_young_couples.png'));
  fs.createReadStream('tmp_uploads/dashboard_vip.png')
    .pipe(fs.createWriteStream('uploads/dashboard_vip.png'));
  fs.createReadStream('tmp_uploads/dashboard_value_for_money.png')
    .pipe(fs.createWriteStream('uploads/dashboard_value_for_money.png'));
  fs.createReadStream('tmp_uploads/dashboard_technology_savvy.png')
    .pipe(fs.createWriteStream('uploads/dashboard_technology_savvy.png'));
  fs.createReadStream('tmp_uploads/dashboard_on_the_go.png')
    .pipe(fs.createWriteStream('uploads/dashboard_on_the_go.png'));
  fs.createReadStream('tmp_uploads/dashboard_mom_baby.png')
    .pipe(fs.createWriteStream('uploads/dashboard_mom_baby.png'));
  fs.createReadStream('tmp_uploads/dashboard_matures.png')
    .pipe(fs.createWriteStream('uploads/dashboard_matures.png'));
  fs.createReadStream('tmp_uploads/dashboard_lunch_time.png')
    .pipe(fs.createWriteStream('uploads/dashboard_lunch_time.png'));
  fs.createReadStream('tmp_uploads/dashboard_low.png')
    .pipe(fs.createWriteStream('uploads/dashboard_low.png'));
  fs.createReadStream('tmp_uploads/dashboard_least_eng.png')
    .pipe(fs.createWriteStream('uploads/dashboard_least_eng.png'));
  fs.createReadStream('tmp_uploads/dashboard_high.png')
    .pipe(fs.createWriteStream('uploads/dashboard_high.png'));
  fs.createReadStream('tmp_uploads/dashboard_explorers.png')
    .pipe(fs.createWriteStream('uploads/dashboard_explorers.png'));
  fs.createReadStream('tmp_uploads/dashboard_enthusiats.png')
    .pipe(fs.createWriteStream('uploads/dashboard_enthusiats.png'));
  fs.createReadStream('tmp_uploads/dashboard_empty_nester.png')
    .pipe(fs.createWriteStream('uploads/dashboard_empty_nester.png'));
  fs.createReadStream('tmp_uploads/dashboard_dinner_party.png')
    .pipe(fs.createWriteStream('uploads/dashboard_dinner_party.png'));
  fs.createReadStream('tmp_uploads/dashboard_deal_shoppers.png')
    .pipe(fs.createWriteStream('uploads/dashboard_deal_shoppers.png'));
  fs.createReadStream('tmp_uploads/dashboard_convenience.png')
    .pipe(fs.createWriteStream('uploads/dashboard_convenience.png'));
  fs.createReadStream('tmp_uploads/dashboard_brand_conscious.png')
    .pipe(fs.createWriteStream('uploads/dashboard_brand_conscious.png'));
  fs.createReadStream('tmp_uploads/dashboard_booze_cruise.png')
    .pipe(fs.createWriteStream('uploads/dashboard_booze_cruise.png'));
	fs.createReadStream('tmp_uploads/dashboard_occasional_spenders.png')
    .pipe(fs.createWriteStream('uploads/dashboard_occasional_spenders.png'));
  fs.createReadStream('tmp_uploads/dashboard_potential_vips.png')
    .pipe(fs.createWriteStream('uploads/dashboard_potential_vips.png'));

	fs.createReadStream('tmp_uploads/dashboard_potential_high.jpg')
    .pipe(fs.createWriteStream('uploads/dashboard_potential_high.jpg'));
	fs.createReadStream('tmp_uploads/dashboard_potential_medium.jpg')
    .pipe(fs.createWriteStream('uploads/dashboard_potential_medium.jpg'));
  fs.createReadStream('tmp_uploads/dashboard_potential_low.jpg')
    .pipe(fs.createWriteStream('uploads/dashboard_potential_low.jpg'));


}

export { setup };
