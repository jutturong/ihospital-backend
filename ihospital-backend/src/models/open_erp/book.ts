import Knex = require('knex');
const maxLimit = 1000;

export class BookModel {

	async getBook(knex: Knex) {
		const sql = `SELECT b.*, w.ward AS ward_name FROM openerp.equipment_book b
        LEFT JOIN hospdata.lib_ward w on b.ward = w.code
        LIMIT 30`
		const result = await knex.raw(sql);
		return result[0];
	}

	async bookDetail(knex: Knex, id: any) {

		const sql = `SELECT d.*, w.ward AS ward_name, em.lend_date, em.return_date FROM openerp.durable d LEFT JOIN 
                    (SELECT m.durable_id, m.lend_date, m.return_date
                    FROM openerp.equipment_monitor m 
                    ORDER BY m.id DESC LIMIT 1) em ON d.id = em.durable_id
                    LEFT JOIN hospdata.lib_ward w on d.ward = w.code
                    WHERE d.id = "${id}"`
		const result = await knex.raw(sql);
		return result[0];
	}

	save(knex: Knex, data: any) {
		return knex('openerp.equipment_tran')
			.insert(data)
			.returning('id');
	}

	saveAssessment(knex: Knex, data: any) {
		return knex('openerp.equipment_assessment')
			.insert(data)
			.bind(console)
			.then(console.log)
			.catch(console.error);
	}

	update(knex: Knex, id: number, data: any) {
		return knex('openerp.equipment_book')
			.where('duequipment_book.id', id)
			.update(data)
			.bind(console)
			.then(console.log)
			.catch(console.error);
	}
}
