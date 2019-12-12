import Knex = require('knex');
const maxLimit = 1000;

export class MonitorModel {

    async getAspiratorss(knex: Knex) {
        const sql = `SELECT p.durablename, count(p.id) FROM durable p JOIN (
            SELECT d.durablename, count(d.id)AS count, d.typecode FROM durable d WHERE d.categorycode = "08"
            GROUP BY d.typecode) AS dd
            ON p.typecode = dd.typecode
            WHERE dd.typecode IN ('พ2201', 'พ0023', 'พ0633', 'พ0420', 'พ0624')
            GROUP BY p.typecode`
            const result = await knex.raw(sql);
        return result[0];
    }

    async getAspirator(knex: Knex) {
        const sql = `SELECT d.id AS main_id, t.generalname, d.an, d.regisno, d.sn, d.number, d.status AS durable_status, d.ward, w.ward AS ward_name, d.durablename, em.lend_date FROM openerp.durable d
        INNER JOIN openerp.types t ON d.typecode = t.typecode
        LEFT JOIN (SELECT m.durable_id, m.lend_date, m.return_date
            FROM openerp.equipment_monitor m 
            ORDER BY m.id DESC) em ON d.id = em.durable_id
        LEFT JOIN hospdata.lib_ward w on d.ward = w.code
        WHERE d.categorycode = "08" AND d.typecode IN ('พ2201', 'พ0023', 'พ0624', 'พ0633', 'พ0420', 'พ0624', 'พ0703', 'พ0610', 'ค2201')
        GROUP BY d.id`
        const result = await knex.raw(sql);
        return result[0];
    }

    async getAspiratorByStatus(knex: Knex, status: any) {
        const sql = `SELECT d.id AS main_id, t.generalname, d.an, d.regisno, d.sn, d.number, d.status AS durable_status, d.ward, w.ward AS ward_name, d.durablename, em.lend_date FROM openerp.durable d
        INNER JOIN openerp.types t ON d.typecode = t.typecode
        LEFT JOIN (SELECT m.durable_id, m.lend_date, m.return_date
            FROM openerp.equipment_monitor m 
            ORDER BY m.id DESC LIMIT 1) em ON d.id = em.durable_id
        LEFT JOIN hospdata.lib_ward w on d.ward = w.code
        WHERE (d.typecode = "${status}" OR d.status = "${status}" OR d.regisno = "${status}")
        GROUP BY d.id`
        const result = await knex.raw(sql);
        return result[0];
    }

    async getAspiratorSelected(knex: Knex, chk: any) {
        const sql = `SELECT d.*, t.generalname FROM openerp.durable d 
        INNER JOIN openerp.types t ON d.typecode = t.typecode
        WHERE d.id IN (${chk}) LIMIT 100`
        const result = await knex.raw(sql);
        return result[0];
    }

    async aspiratorDetail(knex: Knex, id: any) {

        const sql = `SELECT d.*, w.ward AS ward_name FROM openerp.durable d
                     LEFT JOIN openerp.equipment_tran t on d.id
                     LEFT JOIN hospdata.lib_ward w on d.ward = w.code
                     WHERE d.id = "${id}"`
        const result = await knex.raw(sql);
        return result[0];
    }

    save(knex: Knex, data: any) {
        return knex('openerp.equipment_monitor')
            .insert(data)
            .bind(console)
            .then(console.log)
            .catch(console.error);
    }

    update(knex: Knex, id: number, data: any) {

        return knex('openerp.durable')
            .where('durable.id', id)
            .update(data)
            .bind(console)
            .then(console.log)
            .catch(console.error);
    }
}
