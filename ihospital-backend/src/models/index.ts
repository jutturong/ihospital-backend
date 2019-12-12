import Knex = require('knex');
import * as moment from 'moment';

export class IndexModel {

    getAnnouce(knex: Knex, month, year) {
        year = year > 2500 ? (year - 543) : year;
        let date1 = moment([year, month-1 ,1]).format('YYYY-MM-DD');
        let date2 = moment(date1).add(1, 'months').
            subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59';
        return knex('intranet.annouce')
            .select('annouce.*')
            .whereBetween('annouce.date_input', [date1, date2])
            .orderBy('annouce.date_input', 'desc')
            .limit(200);
    }

    getMyI18N(knex: Knex, textSearch, lang='en') {
        if (textSearch){
            return knex('i18n_mapper')
                .select(`${lang} as text`)
                .where('th', '=', textSearch)
                .where(lang, '!=', '')
                .limit(1);
        } else {
            return knex('i18n_mapper')
                .select('*')
                .orderBy('th');
        }
    }

    searchAnnouce(knex: Knex, textSearch) {
        return knex('intranet.annouce')
            .select('annouce.*')
            .where('annouce.topic', 'like', `%${textSearch}%`)
            .orderBy('annouce.date_input', 'desc')
            .limit(100);
    }

    sumAnnouce(knex: Knex, year) {
        const sql = `select substr(date_input,1,7) as month_date , count(1) as no
            from intranet.annouce
            where substr(date_input,1,4)="${year}"
            group by month_date;`;
        return knex.raw(sql);
    }

}  