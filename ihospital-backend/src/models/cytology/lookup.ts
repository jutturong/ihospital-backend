import Knex = require('knex');
import * as moment from 'moment';

export class LookupModel {

  public tableName = 'app_cytology.cyto_in';
  public primaryKey = 'ref';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .orderBy('ref','desc')
      .limit(limit)
      .offset(offset);
  }

  listCyto_type(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cytology.lib_cyto_type')
      .limit(limit)
      .offset(offset);
  }

  listSmear_type(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cytology.lib_smear_type')
      .limit(limit)
      .offset(offset);
  }

  listSpecimen(knex: Knex) {
    return knex('app_cytology.lib_specimen');
  }

  listAdequacy(knex: Knex) {
    return knex('app_cytology.lib_adequacy');
  }

  listAspecimen(knex: Knex) {
    return knex('app_cytology.lib_adequacy_specimen');
  }

  listAdequacy_parent(knex: Knex) {
    return knex('app_cytology.lib_adequacy_parent');
  }

  listCytist(knex: Knex) {
    return knex('app_cytology.lib_cytist');
  }
  
  listResult(knex: Knex) {
    return knex('app_cytology.lib_result');
  }
  

}