import Knex = require('knex');

export class UtilsModel {

    saveDrugCatalog(knex: Knex, arrData) {
        return knex('hospdata.pharmacy_drug_catalog').insert(arrData)
            .returning('catalog_id');
    }

    get1(knex: Knex, id) {
        return knex.select('*')
            .from('pharmacy_drug_catalog')
            .where('hospcode', '=', id);
    }

  /*
    sys_mobile_device table
    collect detail of mobile device each  employee
  */

    // Save and update sys_mobile_device
    // parameter ref > 0 for update sql
    saveSysMobileDevice(knex: Knex, ref = 0, data) {
        if (ref > 0) {
            return knex('sys_mobile_device')
                .update(data)
                .where('id', ref)
                .returning(['id', 'employee_id', 'uuid', 'imei']);
        } else {
            return knex('sys_mobile_device')
                .insert(data)
                .returning(['id', 'employee_id', 'uuid', 'imei']);
        }
    }

    // delete sys_mobile_device
    // when ref = 0 return null
    deleteSysMobileDevice(knex: Knex, ref = 0) {
        if (ref > 0) {
            return knex('sys_mobile_device')
                .del()
                .where('id', ref)
                .returning(['id', 'employee_id', 'uuid', 'imei']);
        } else {
            return null;
        }
    }

    // get from sys_mobile_device
    // parameter typeSearch = column name, textSearch = search text, typeCompare = operator
    getSysMobileDevice(knex: Knex, typeSearch = 'id', textSearch = '', typeCompare = '=') {
        if (textSearch === '') {
            return null;
        } else {
            textSearch = typeCompare === 'like' ? '%'+textSearch+'%' : textSearch;
            return knex('sys_mobile_device')
                .select('*')
                .where(typeSearch, typeCompare, textSearch);
        }
    }

}
