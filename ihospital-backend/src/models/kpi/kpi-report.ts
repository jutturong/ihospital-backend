import Knex = require('knex');
const maxLimit = 2500;

export class KpiReport {
    
    getReportByFiscal(knex: Knex, groupId, fiscal_year) {

        let sql = `
        select
        a.group_id
        ,a.name
        ,c.prefix
        ,b.kpi_id
        ,if(c.rate >0, c.rate,1) as rate
        ,c.unit
        ,TRUNCATE(sum(if(b.month='10' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'oct'
        ,TRUNCATE(sum(if(b.month='11' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'nov'
        ,TRUNCATE(sum(if(b.month='12' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'dec'
        ,TRUNCATE(sum(if(b.month='1' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'jan'
        ,TRUNCATE(sum(if(b.month='2' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'feb'
        ,TRUNCATE(sum(if(b.month='3' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'mar'
        ,TRUNCATE(sum(if(b.month='4' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'apr'
        ,TRUNCATE(sum(if(b.month='5' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'may'
        ,TRUNCATE(sum(if(b.month='6' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'jun'
        ,TRUNCATE(sum(if(b.month='7' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'jul'
        ,TRUNCATE(sum(if(b.month='8' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'aug'
        ,TRUNCATE(sum(if(b.month='9' and b.fiscal_year= "${fiscal_year}",(b.multiplicand/(if(b.denominator>0,b.denominator,1))),''))*(if(c.rate>0,c.rate,1)),2) as 'sep'
        from intranet.kpi_group_topic a
        left join 	intranet.kpi_topic	c	on	a.kpi_id = c.kpi_id
        left join 	intranet.kpi_data 	b	ON	a.kpi_id = b.kpi_id
        where a.group_id = "${groupId}" and b.kpi_id >0 and c.isactive = 1
        group by a.kpi_id
        `;

        return knex.raw(sql);
    }

}