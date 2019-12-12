import Knex = require('knex');
const maxLimit = 1000;

export class EquipmentLibModel {

	listPttype(knex: Knex, limit: number = 100, offset: number = 0) {
		return knex('lib_pttype')
			.where('isactive', 1)
			.limit(limit)
			.offset(offset);
	}

	listLibDischt(knex: Knex, limit: number = 100) {
		return knex('hospdata.lib_discht')
			.limit(limit)
	}

	listWard(db: Knex, id: any) {
		if(id != null){
			return db('hospdata.lib_ward ')
			.select('lib_ward.*')
			.where('ward',  id)
			.limit(1000);
		}else{
			return db('hospdata.lib_ward')
			.select('lib_ward.*')
			.limit(1000);
		}
	}
}
