import Knex = require('knex');
const maxLimit = 1000;

export class EquipmentModel {

	async getEquipmentType(knex: Knex) {
		const sql = `SELECT t.typecode, t.typename, t.generalname, t.groupcode, count(d.id) AS count FROM openerp.types t
		LEFT JOIN  openerp.durable d on t.typecode = d.typecode
		WHERE t.typecode IN  ("พ2201", "พ0703", "พ0610", "พ0023", "พ0624", "พ0633", "พ0420", "พ0624", "ค2201")
		GROUP BY d.typecode 
		ORDER BY t.generalname ASC`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getEquipmentTypeByCode(knex: Knex, id) {
		const sql = `SELECT t.typecode, t.typename, t.generalname, t.groupcode, count(d.id) AS count FROM openerp.types t
		LEFT JOIN  openerp.durable d on t.typecode = d.typecode
		WHERE t.typecode = "${id}"`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getEquipmentBook(knex: Knex) {
		const sql = `SELECT b.*, w.ward AS ward_name FROM openerp.equipment_book b
        LEFT JOIN hospdata.lib_ward w on b.ward = w.code
        LIMIT 30`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getEquipment(knex: Knex) {
		const sql = `SELECT d.*, t.generalname, w.ward AS ward_name FROM openerp.durable d
        INNER JOIN openerp.types t ON d.typecode = t.typecode
        LEFT  JOIN hospdata.lib_ward w on d.ward = w.code
		WHERE (d.number <> null OR d.number <> "") AND d.typecode IN ('พ2201', 'พ0023', 'พ0624', 'พ0633', 'พ0420', 'พ0624', 'พ0703', 'พ0610', 'ค2201')
		ORDER BY d.number
		`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getEquipmentBySearch(knex: Knex, term: any) {
		const sql = `SELECT d.*, t.generalname, w.ward AS ward_name FROM openerp.durable d
        INNER JOIN openerp.types t ON d.typecode = t.typecode
        LEFT  JOIN hospdata.lib_ward w on d.ward = w.code
        WHERE (d.number <> null OR d.number <> "") AND ( d.typecode IN ('พ2201', 'พ0023', 'พ0624', 'พ0633', 'พ0420', 'พ0624', 'พ0703', 'พ0610', 'ค2201') AND d.status = "${term}") OR d.typecode = "${term}"`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getEquipmentByGroup(knex: Knex, typecode: any) {
		const sql = `SELECT d.* FROM openerp.durable d
		WHERE d.status = "N" AND d.typecode = "${typecode}"`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getEquipmentByWard(knex: Knex, ward: any, status: any) {
		if (ward !== 'undefined' && status === 'undefined') {
			const sql = `SELECT distinct d.id, d.regisno, IFNULL(count_pt.cp, 0) AS cp, d.durablename, t.id AS tran_id, t.hn, t.an, w.code AS ward_code, t.erp_medical, t.erp_want, t.erp_topping, t.parrent, y.typename, y.generalname
				,IF(t.status='O',mt.tran_date,t.tran_date) AS tran_date
				, t.status, p.title, p.name, p.surname, w.ward AS ward_tran FROM openerp.equipment_tran t 
		
				LEFT JOIN hospdata.patient p ON t.hn = p.hn
				LEFT JOIN openerp.durable d ON t.durable_id = d.id
				INNER JOIN openerp.types y ON t.erp_medical = y.typecode
				LEFT JOIN hospdata.ipd_ipd i on t.an = i.an
				INNER JOIN hospdata.lib_ward w on t.ward = w.code
		
				LEFT JOIN 
				(SELECT MAX(id) as id, durable_id, parrent, MAX(tran_date) AS tran_date, hn, an , status
				FROM openerp.equipment_tran
				WHERE status = "O"
				GROUP BY parrent) AS mt ON mt.parrent = t.parrent

				LEFT JOIN (SELECT COUNT(*) AS cp, parrent FROM openerp.equipment_tran GROUP BY parrent) AS count_pt ON count_pt.parrent = t.id

				WHERE t.ward = "${ward}"

				ORDER BY t.parrent 

				`
			const result = await knex.raw(sql);
			return result[0];

		}
		else if (ward !== 'undefined' && status !== 'undefined') {
			console.log(status);
			const sql = `SELECT distinct d.id, d.regisno, IFNULL(count_pt.cp, 0) AS cp,  d.durablename, t.id AS tran_id, t.hn, t.an, w.code AS ward_code, t.erp_medical, t.erp_want, t.erp_topping, t.parrent, y.typename, y.generalname
				,IF(t.status='O',mt.tran_date,t.tran_date) AS tran_date
				, t.status, p.title, p.name, p.surname, w.ward AS ward_tran FROM openerp.equipment_tran t 
		
				LEFT JOIN hospdata.patient p ON t.hn = p.hn
				LEFT JOIN openerp.durable d ON t.durable_id = d.id
				INNER JOIN openerp.types y ON t.erp_medical = y.typecode
				LEFT JOIN hospdata.ipd_ipd i on t.an = i.an
				INNER JOIN hospdata.lib_ward w on t.ward = w.code
		
				LEFT JOIN 
				(SELECT MAX(id) as id, durable_id, parrent, MAX(tran_date) AS tran_date, hn, an , status
				FROM openerp.equipment_tran
				WHERE status = "O"
				GROUP BY parrent) AS mt ON mt.parrent = t.parrent

				LEFT JOIN (SELECT COUNT(*) AS cp, parrent FROM openerp.equipment_tran GROUP BY parrent) AS count_pt ON count_pt.parrent = t.id

				WHERE t.ward = "${ward}" AND t.status = "${status}"

				ORDER BY t.parrent 

				`
			const result = await knex.raw(sql);
			return result[0];
		}
		else if (ward === 'undefined' && status === 'undefined') {
			const sql = `SELECT distinct d.id, d.regisno, IFNULL(count_pt.cp, 0) AS cp, d.durablename, t.id AS tran_id, t.hn, t.an, w.code AS ward_code, t.erp_medical, t.erp_want, t.erp_topping, t.parrent, y.typename, y.generalname
				,IF(t.status='O',mt.tran_date,t.tran_date) AS tran_date
				, t.status, p.title, p.name, p.surname, w.ward AS ward_tran FROM openerp.equipment_tran t 
			
				LEFT JOIN hospdata.patient p ON t.hn = p.hn
				LEFT JOIN openerp.durable d ON t.durable_id = d.id
				INNER JOIN openerp.types y ON t.erp_medical = y.typecode
				LEFT JOIN hospdata.ipd_ipd i on t.an = i.an
				INNER JOIN hospdata.lib_ward w on t.ward = w.code
			
				LEFT JOIN 
				(SELECT MAX(id) as id, durable_id, parrent, MAX(tran_date) AS tran_date, hn, an , status
				FROM openerp.equipment_tran
				WHERE status = "O"
				GROUP BY parrent) AS mt ON mt.parrent = t.parrent

				LEFT JOIN (SELECT COUNT(*) AS cp, parrent FROM openerp.equipment_tran GROUP BY parrent) AS count_pt ON count_pt.parrent = t.id

				ORDER BY t.parrent 
				`
			const result = await knex.raw(sql);
			return result[0];

		} else {
			const sql = `SELECT distinct d.id, d.regisno, IFNULL(count_pt.cp, 0) AS cp, d.durablename, t.id AS tran_id, t.hn, t.an, w.code AS ward_code, t.erp_medical, t.erp_want, t.erp_topping, t.parrent, y.typename, y.generalname
				,IF(t.status='O',mt.tran_date,t.tran_date) AS tran_date
				, t.status, p.title, p.name, p.surname, w.ward AS ward_tran FROM openerp.equipment_tran t 
			
				LEFT JOIN hospdata.patient p ON t.hn = p.hn
				LEFT JOIN openerp.durable d ON t.durable_id = d.id
				INNER JOIN openerp.types y ON t.erp_medical = y.typecode
				LEFT JOIN hospdata.ipd_ipd i on t.an = i.an
				INNER JOIN hospdata.lib_ward w on t.ward = w.code
			
				LEFT JOIN 
				(SELECT MAX(id) as id, durable_id, parrent, MAX(tran_date) AS tran_date, hn, an , status
				FROM openerp.equipment_tran
				WHERE status = "O"
				GROUP BY parrent) AS mt ON mt.parrent = t.parrent
				LEFT JOIN (SELECT COUNT(*) AS cp, parrent FROM openerp.equipment_tran GROUP BY parrent) AS count_pt ON count_pt.parrent = t.id

				ORDER BY t.parrent 
				`
			const result = await knex.raw(sql);
			return result[0];
		}

	}

	async getEquipmentStock(knex: Knex) {
		const sql = `SELECT d1.typecode, t.typename, t.generalname, IFNULL(count(d1.id), 0) AS count_d1, IFNULL(d2.countid, 0) AS count_d2 FROM openerp.durable d1
		LEFT JOIN(
		SELECT typecode, IFNULL(count(id), 0) AS countid FROM openerp.durable WHERE typecode IN ('พ2201', 'พ0023', 'พ0624', 'พ0633', 'พ0420', 'พ0624', 'พ0703', 'พ0610', 'ค2201') AND status <> 'N'
		GROUP BY typecode) AS d2 ON d2.typecode = d1.typecode
		LEFT JOIN openerp.types t ON d1.typecode = t.typecode
		WHERE d1.typecode IN  ('พ2201', 'พ0023', 'พ0624', 'พ0633', 'พ0420', 'พ0624', 'พ0703', 'พ0610', 'ค2201') AND d1.status = "N"
		GROUP BY d1.typecode`
		const result = await knex.raw(sql);
		return result[0];
	}

	async equipmentDetail(knex: Knex, id: any) {
		const sql = `SELECT d.*, w.ward AS ward_name, em.lend_date, em.return_date FROM openerp.durable d LEFT JOIN 
                    (SELECT m.durable_id, m.lend_date, m.return_date
                    FROM openerp.equipment_monitor m 
                    ORDER BY m.id DESC LIMIT 1) em ON d.id = em.durable_id
                    LEFT JOIN hospdata.lib_ward w on d.ward = w.code
                    WHERE d.id = "${id}"`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getPatientAdmint(knex: Knex, term: any) {
		const sql = `SELECT * FROM hospdata.ipd_ipd WHERE an = "${term}"`
		const result = await knex.raw(sql);
		return result[0];
	}

	async getPatientVisit(knex: Knex, term: any) {
		const sql = `SELECT p.* FROM hospdata.opd_visit o
		LEFT JOIN  hospdata.patient p on o.hn = p.hn
		WHERE o.hn = "${term}" ORDER BY o.hn DESC LIMIT 1`
		const result = await knex.raw(sql);
		return result[0];
	}

	saveDurable(knex: Knex, data: any) {
		return knex('openerp.durable').insert(data);
	}

	save(knex: Knex, data: any) {
		return knex('openerp.equipment_book')
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
