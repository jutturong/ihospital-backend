import Knex = require('knex');
const maxLimit = 1000;

export class TranModel {

	async getTran(knex: Knex) {
		const sql = `SELECT t.*, i.title, i.name, i.surname, w.ward AS ward_name FROM openerp.equipment_tran t
		INNER JOIN hospdata.ipd_ipd i on t.an = i.an 
        LEFT JOIN hospdata.lib_ward w on t.ward = w.code
        LIMIT 20`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getTranRequest(knex: Knex) {
		const sql = `SELECT d.*, t.hn, y.generalname, y.typecode, t.id AS tran_id, t.an, y.typename, t.erp_medical, t.erp_want, t.erp_topping, t.tran_date, t.status AS tran_status, p.title, p.name, p.surname, w.ward AS ward_tran, t.ward AS ward_id FROM openerp.equipment_tran t 
		INNER JOIN hospdata.patient p on t.hn = p.hn
		LEFT JOIN openerp.durable d ON t.durable_id = d.id
		LEFT JOIN openerp.types y ON t.erp_medical = y.typecode
		LEFT JOIN hospdata.ipd_ipd i on t.an = i.an
		LEFT JOIN hospdata.lib_ward w on t.ward = w.code
		WHERE t.status = 'B'
		ORDER BY t.tran_date ASc,  t.an ASC `
		const result = await knex.raw(sql);
		return result[0];
	}

	async getEquipment(knex: Knex) {
		const sql = `SELECT d.* FROM durable d
		WHERE d.typecode IN ('พ2201', 'พ2202')`
		const result = await knex.raw(sql);
		return result[0];
	}

	async tranDetail(knex: Knex, id: any) {

		const sql = `SELECT d.*, w.ward AS ward_name, em.lend_date, em.return_date FROM openerp.durable d LEFT JOIN 
                    (SELECT m.durable_id, m.lend_date, m.return_date
                    FROM openerp.equipment_monitor m 
                    ORDER BY m.id DESC LIMIT 1) em ON d.id = em.durable_id
                    LEFT JOIN hospdata.lib_ward w on d.ward = w.code
                    WHERE d.id = "${id}"`
		const result = await knex.raw(sql);
		return result[0];
	}

	remove(knex: Knex, id: number) {
		return knex('openerp.equipment_tran')
		  .where('equipment_tran.id', id)
		  .del();
	  }

	save(knex: Knex, data: any) {
		return knex('openerp.equipment_tran').insert(data)
	}

	saveRes(knex: Knex, data: any) {
		return knex('openerp.equipment_respiratory').insert(data)
	}

	update(knex: Knex, id: number, data: any) {
		return knex('openerp.equipment_tran')
			.where('equipment_tran.id', id)
			.update(data)
			.bind(console)
			.then(console.log)
			.catch(console.error);
	}

	updateDurable(knex: Knex, id: number, data: any) {
		return knex('openerp.durable')
			.where('durable.id', id)
			.update(data)
			.bind(console)
			.then(console.log)
			.catch(console.error);
	}

	async tranStatusUse(knex: Knex, id: any) {
		const sql = `SELECT * FROM openerp.equipment_tran WHERE parrent = "${id}" AND status = "O"`
		const result = await knex.raw(sql);
		return result[0];
	}
}
