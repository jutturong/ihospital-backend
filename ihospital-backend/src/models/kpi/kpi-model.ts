import Knex = require('knex');
const maxLimit = 2500;

export class KpiModel {
    getTopic(db: Knex) {
        return db('intranet.kpi_topic')
            .orderBy('seq')
            .limit(maxLimit);
    }
    getActiveTopic(db: Knex) {
        return db('intranet.kpi_topic')
            .where('isactive', '1')
            .orderBy('seq')
            .limit(maxLimit);
    }
    searchTopic(db: Knex, columnName = 'name', searchValue) {
        return db('intranet.kpi_topic')
            .where(columnName, 'like', '%' + searchValue + '%')
            .orderBy('seq')
            .limit(maxLimit);
    }

    async saveTopic(db: Knex, kpiId = 0, data) {
        if (+kpiId > 0) {
            return db('intranet.kpi_topic')
                .update(data)
                .where('kpi_id', '=', kpiId);
        } else {
            return db('intranet.kpi_topic')
                .insert(data);
        }
    }


    async saveGroup(db: Knex, groupId = 0, data) {
        if (+groupId > 0) {
            return db('intranet.kpi_group')
                .update(data)
                .where('group_id', '=', groupId);
        } else {
            return db('intranet.kpi_group')
                .insert(data);
        }
    }

    async saveGroupTopic(db: Knex, ref = 0, data) {
        if (+ref > 0) {
            return db('intranet.kpi_group_topic')
                .update(data)
                .where('ref', '=', ref);
        } else {
            return db('intranet.kpi_group_topic')
                .insert(data);
        }
    }

    getGroup(db: Knex) {
        return db('intranet.kpi_group')
            .orderBy('group_name')
            .limit(maxLimit);
    }

    getActiveGroup(db: Knex) {
        return db('intranet.kpi_group')
            .where('isactive', '1')
            .orderBy('group_name')
            .limit(maxLimit);
    }

    searchGroup(db: Knex, columnName = 'group_name', searchValue) {
        return db('intranet.kpi_group')
            .where(columnName, 'like', '%' + searchValue + '%')
            .limit(maxLimit);
    }

    getTopicByGroup(db: Knex, groupId) {
        return db('intranet.kpi_group_topic')
            .where('group_id', groupId)
            .orderByRaw('isactive desc,seq asc')
            .limit(maxLimit);
    }
    getActiveTopicByGroup(db: Knex, groupId) {
        return db('intranet.kpi_group_topic')
            .where('group_id', groupId)
            .where('isactive', '1')
            .orderBy('seq')
            .limit(maxLimit);
    }

    saveAncScreening(knex: Knex, screenId = 0, arrData) {
        if (screenId === 0) {
            return knex('anc.anc_screening')
                .insert(arrData)
                .returning('screen_id');
        } else {
            return knex('anc.anc_screening')
                .update(arrData)
                .where('screen_id', '=', screenId)
                .returning('screen_id');
        }

    }

    saveData(knex: Knex, tableName = '', columnPK = '', textSearch, dataArray) {
        if (tableName === '' || columnPK === '' || !dataArray) {
            return null;
        }
        if (columnPK !== '' && textSearch !== '' && textSearch !== '0') {
            return knex(tableName)
                .update(dataArray)
                .where(columnPK, '=', textSearch)
                .returning(columnPK);
        } else {
            return knex(tableName)
                .insert(dataArray)
                .returning(columnPK);
        }
    }

    deleteAncScreening(knex: Knex, screenId = 0) {
        if (screenId > 0) {
            return knex
                .del('anc.anc_screening')
                .where('screen_id', '=', screenId)
                .returning('screen_id');
        } else {
            return null;
        }
    }


    getKpiForInput(knex: Knex, groupId) {

        let sql = `
            select a.seq as kpi_seq,b.*
            from intranet.kpi_group_topic a
            left join 
            intranet.kpi_topic b		on 		a.kpi_id = b.kpi_id
            where a.group_id = "${groupId}" and a.isactive = 1 and b.isactive=1
            order by a.isactive desc,a.seq asc
        `;

        return knex.raw(sql);
    }

    getKpiData(db: Knex, kpi_id=0, year: number) {
        return db('intranet.kpi_data')
            .where('kpi_id', kpi_id)
            .where('year', year)
            .orderBy('month')
            .limit(maxLimit);
    }

    saveKpiData(knex: Knex, datas: any) {
        return knex('intranet.kpi_data')
          .insert(datas);
      }
    
    updateKpiData(knex: Knex, kpi_id: string, year: number, month: number, datas: any) {
        return knex('intranet.kpi_data')
          .where('kpi_id', kpi_id)
          .where('year', year)
          .where('month', month)
          .update(datas);
      }

    updateKpiMulti(knex: Knex, kpi_id: number, datas: any) {
        const firstData = datas[0] ? datas[0] : datas;
        return knex.raw(knex('intranet.kpi_data').insert(datas).toQuery() + " ON DUPLICATE KEY UPDATE " +
        Object.getOwnPropertyNames(firstData).map((field) => `${field}=VALUES(${field})`).join(", "));
    }

    // async saveKpiData(db: Knex, kpi_id = 0, year:number, month:number, data) {
    //     if (+kpi_id >0 && year && month) {
    //         return db('intranet.kpi_group_topic')
    //             .update(data)
    //             .where('ref', '=', kpi_id);
    //     } else {
    //         return db('intranet.kpi_group_topic')
    //             .insert(data);
    //     }
    // }



}