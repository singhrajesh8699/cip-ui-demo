
import fsSync from 'fs';

import * as fs from 'async-file';

async function setup() {
  
  try {
    console.log("Seeding uploads directory\n");
    if (!fsSync.existsSync('uploads/')){
      fsSync.mkdirSync('uploads/');
    }

    await fs.createReadStream('tmp_uploads/vinod.png')
      .pipe(fs.createWriteStream('uploads/vinod.png'));

    await fs.createReadStream('tmp_uploads/venn.jpg')
      .pipe(fs.createWriteStream('uploads/venn.jpg'));
    await fs.createReadStream('tmp_uploads/bubble1.png')
      .pipe(fs.createWriteStream('uploads/bubble1.png'));
    await fs.createReadStream('tmp_uploads/bubble2.png')
      .pipe(fs.createWriteStream('uploads/bubble2.png'));
    await fs.createReadStream('tmp_uploads/empty_nesters.jpeg')
      .pipe(fs.createWriteStream('uploads/empty_nesters.jpeg'));
    await fs.createReadStream('tmp_uploads/momnbaby.jpeg')
      .pipe(fs.createWriteStream('uploads/momnbaby.jpeg'));
    await fs.createReadStream('tmp_uploads/young_singles.jpeg')
      .pipe(fs.createWriteStream('uploads/young_singles.jpeg'));
    await fs.createReadStream('tmp_uploads/young_couples.jpeg')
      .pipe(fs.createWriteStream('uploads/young_couples.jpeg'));

    await fs.createReadStream('tmp_uploads/rfv_leastval.jpg')
      .pipe(fs.createWriteStream('uploads/rfv_leastval.jpg'));
    await fs.createReadStream('tmp_uploads/rfv_mostval.jpg')
      .pipe(fs.createWriteStream('uploads/rfv_mostval.jpg'));

    await fs.createReadStream('tmp_uploads/scheme_lifestage_small.jpg')
      .pipe(fs.createWriteStream('uploads/scheme_lifestage_small.jpg'));
    await fs.createReadStream('tmp_uploads/scheme_potential_small.jpg')
      .pipe(fs.createWriteStream('uploads/scheme_potential_small.jpg'));
    await fs.createReadStream('tmp_uploads/scheme_rfv_small.png')
      .pipe(fs.createWriteStream('uploads/scheme_rfv_small.png'));
    await fs.createReadStream('tmp_uploads/scheme_missions_small.png')
      .pipe(fs.createWriteStream('uploads/scheme_missions_small.png'));
    await fs.createReadStream('tmp_uploads/scheme_lifestyle_small.jpg')
      .pipe(fs.createWriteStream('uploads/scheme_lifestyle_small.jpg'));
    await fs.createReadStream('tmp_uploads/mombaby.jpg')
      .pipe(fs.createWriteStream('uploads/mombaby.jpg'));
    await fs.createReadStream('tmp_uploads/enthusiats.jpg')
      .pipe(fs.createWriteStream('uploads/enthusiats.jpg'));
    await fs.createReadStream('tmp_uploads/vip.jpg')
      .pipe(fs.createWriteStream('uploads/vip.jpg'));
    await fs.createReadStream('tmp_uploads/matures.jpg')
      .pipe(fs.createWriteStream('uploads/matures.jpg'));

    await fs.createReadStream('tmp_uploads/dashboard_young_single.png')
      .pipe(fs.createWriteStream('uploads/dashboard_young_single.png'));
    await fs.createReadStream('tmp_uploads/dashboard_young_couples.png')
      .pipe(fs.createWriteStream('uploads/dashboard_young_couples.png'));
    await fs.createReadStream('tmp_uploads/dashboard_vip.png')
      .pipe(fs.createWriteStream('uploads/dashboard_vip.png'));
    await fs.createReadStream('tmp_uploads/dashboard_value_for_money.png')
      .pipe(fs.createWriteStream('uploads/dashboard_value_for_money.png'));
    await fs.createReadStream('tmp_uploads/dashboard_technology_savvy.png')
      .pipe(fs.createWriteStream('uploads/dashboard_technology_savvy.png'));
    await fs.createReadStream('tmp_uploads/dashboard_on_the_go.png')
      .pipe(fs.createWriteStream('uploads/dashboard_on_the_go.png'));
    await fs.createReadStream('tmp_uploads/dashboard_mom_baby.png')
      .pipe(fs.createWriteStream('uploads/dashboard_mom_baby.png'));
    await fs.createReadStream('tmp_uploads/dashboard_matures.png')
      .pipe(fs.createWriteStream('uploads/dashboard_matures.png'));
    await fs.createReadStream('tmp_uploads/dashboard_lunch_time.png')
      .pipe(fs.createWriteStream('uploads/dashboard_lunch_time.png'));
    await fs.createReadStream('tmp_uploads/dashboard_low.png')
      .pipe(fs.createWriteStream('uploads/dashboard_low.png'));
    await fs.createReadStream('tmp_uploads/dashboard_least_eng.png')
      .pipe(fs.createWriteStream('uploads/dashboard_least_eng.png'));
    await fs.createReadStream('tmp_uploads/dashboard_high.png')
      .pipe(fs.createWriteStream('uploads/dashboard_high.png'));
    await fs.createReadStream('tmp_uploads/dashboard_explorers.png')
      .pipe(fs.createWriteStream('uploads/dashboard_explorers.png'));
    await fs.createReadStream('tmp_uploads/dashboard_enthusiats.png')
      .pipe(fs.createWriteStream('uploads/dashboard_enthusiats.png'));
    await fs.createReadStream('tmp_uploads/dashboard_empty_nester.png')
      .pipe(fs.createWriteStream('uploads/dashboard_empty_nester.png'));
    await fs.createReadStream('tmp_uploads/dashboard_dinner_party.png')
      .pipe(fs.createWriteStream('uploads/dashboard_dinner_party.png'));
    await fs.createReadStream('tmp_uploads/dashboard_deal_shoppers.png')
      .pipe(fs.createWriteStream('uploads/dashboard_deal_shoppers.png'));
    await fs.createReadStream('tmp_uploads/dashboard_convenience.png')
      .pipe(fs.createWriteStream('uploads/dashboard_convenience.png'));
    await fs.createReadStream('tmp_uploads/dashboard_brand_conscious.png')
      .pipe(fs.createWriteStream('uploads/dashboard_brand_conscious.png'));
    await fs.createReadStream('tmp_uploads/dashboard_booze_cruise.png')
      .pipe(fs.createWriteStream('uploads/dashboard_booze_cruise.png'));
  	await fs.createReadStream('tmp_uploads/dashboard_occasional_spenders.png')
      .pipe(fs.createWriteStream('uploads/dashboard_occasional_spenders.png'));
    await fs.createReadStream('tmp_uploads/dashboard_potential_vips.png')
      .pipe(fs.createWriteStream('uploads/dashboard_potential_vips.png'));

  	await fs.createReadStream('tmp_uploads/dashboard_potential_high.jpg')
      .pipe(fs.createWriteStream('uploads/dashboard_potential_high.jpg'));
  	await fs.createReadStream('tmp_uploads/dashboard_potential_medium.jpg')
      .pipe(fs.createWriteStream('uploads/dashboard_potential_medium.jpg'));
    await fs.createReadStream('tmp_uploads/dashboard_potential_low.jpg')
      .pipe(fs.createWriteStream('uploads/dashboard_potential_low.jpg'));

    console.log("Seeded uploads directory\n");
  }
  catch (err) {
    console.log(err);
  }
}

export { setup };
