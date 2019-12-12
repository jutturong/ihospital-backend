import Knex = require('knex');
import * as moment from 'moment';
const maxLimit = 250;
const dbName = process.env.DRUG_DB_NAME;
const dbClient = process.env.DRUG_DB_CLIENT;

export class IpdDrugModel {

  getTableName(db: Knex, dbname = dbName) {
    const whereDB = dbClient === 'mssql' ? 'TABLE_CATALOG' : 'TABLE_SCHEMA';
    return db('information_schema.tables')
      .select('TABLE_NAME')
      .where(whereDB, dbname)
      .where('TABLE_TYPE', 'BASE TABLE');
  }

  getDrugGeneric(db: Knex) {
    return db('ms_drug_generic')
      .limit(maxLimit);
  }

  searchDrugGeneric(db: Knex, columnName='genericname', searchValue) {
    return db('ms_drug_generic')
      .where(columnName, 'like', `%${searchValue}%`)
      .limit(maxLimit);
  }

}