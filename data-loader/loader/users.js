import async from 'async';
import * as fs from 'async-file';

async function loadAdmins(db)
{
    // create a user
    // Insert DB user
    // password: vinod
    await db.users.insert({ "name" : "Vinod Jayakumar",
                            "password" : "$2a$10$aU3kDmu/mRVOz4TOv8ygC.a5HmTnwgKpHL8TqxqpVJazuuHec9T.m",
                            "salt" : "$2a$10$aU3kDmu/mRVOz4TOv8ygC.",
                            "email" : "vinod@dataxylo.com",
                            "thumbnail": "vinod.png",
                            "last_login" : null,
                            "ma_user" : false,
                            "da_user" : false,
                            "dx_user" : false,
                            "sa_user" : true});

}

async function loadTenant(db, tenantObj)
{   
    var tenant_name_lc = tenantObj.name.toLowerCase();

    // Tenant Logo
    var tenant_logo_src = __dirname + '/../data/' + tenant_name_lc + '/logo.jpg';
    var tenant_logo_dest = __dirname + '/../../uploads/' + tenant_name_lc + '.jpg';

    await fs.createReadStream(tenant_logo_src)
      .pipe(fs.createWriteStream(tenant_logo_dest));

    // Tenant DA User 
    var thumbnail = tenant_name_lc + '_da1.jpg';
    var name = tenantObj.name + ' DA User1';
    var email = 'dauser1@' + tenant_name_lc + '.com';

    var tenant_user_src = __dirname + '/../data/' + tenant_name_lc + '/user_da1.jpg';
    var tenant_user_dest = __dirname + '/../../uploads/' + thumbnail;
    await fs.createReadStream(tenant_user_src)
      .pipe(fs.createWriteStream(tenant_user_dest));

    // DA User1
    // password: dauser1
    await db.users.insert({ "salt" : "$2a$10$rEOizE7IqiD7MD72GESXRu",
                          "is_verified" : false,
                          "is_logged_in" : false,
                          "tenant" : tenantObj,
                          "name" : name,
                          "thumbnail": thumbnail,
                          "password" : "$2a$10$rEOizE7IqiD7MD72GESXRuelUZNF1fp662tzRfrmVfi40dpYnrgoK",
                          "email" : email,
                          "last_login" : null,
                          "ma_user" : false,
                          "da_user" : true,
                          "dx_user" : false,
                          "sa_user" : false
                        });

    thumbnail = tenant_name_lc + '_ma1.jpg';
    name = tenantObj.name + ' MA User1';
    email = 'mauser1@' + tenant_name_lc + '.com';

    tenant_user_src = __dirname + '/../data/' + tenant_name_lc + '/user_ma1.jpg';
    tenant_user_dest = __dirname + '/../../uploads/' + thumbnail;
    await fs.createReadStream(tenant_user_src)
      .pipe(fs.createWriteStream(tenant_user_dest));

    // password: mauser1
    await db.users.insert({ "salt" : "$2a$10$xROCLvSq55V1LSpXcPTah.",
                        "is_verified" : false,
                        "is_logged_in" : false,
                        "tenant" : tenantObj,
                        "name" : name,
                        "thumbnail": thumbnail,
                        "password" : "$2a$10$xROCLvSq55V1LSpXcPTah.2s7XeaQjvRPaRP1K06I6aIz4OjfxVrq",
                        "email" : email,
                        "last_login" : null,
                        "ma_user" : true,
                        "da_user" : false,
                        "dx_user" : false,
                        "sa_user" : false
                      });
}

export { loadAdmins, loadTenant };
