import Knex = require('knex');
import * as moment from 'moment';

export class ReportModel {

  public tableName = 'budget62.budget_personal';
  public primaryKey = 'ref';


  totalRequest(knex: Knex, offset: number = 0) {
    return knex('budget62.view_request')
      .offset(offset);
  }
  totalRequest61(knex: Knex, offset: number = 0) {
    return knex('budget61.view_request')
      .offset(offset);
  }

  totalRequestByOffice(knex: Knex, office:string, offset: number = 0) {
    return knex('budget62.view_request')
      .where('office',office)
      .offset(offset);
  }
  totalRequest61ByOffice(knex: Knex,office:string, offset: number = 0) {
    return knex('budget61.view_request')
      .where('office',office)
      .offset(offset);
  }
  reportRequestGroupByOffice(knex: Knex,fiscal_year: number, offset: number = 0) {
    let sql62 = `select
    a.office
    ,a.office_name
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
    from
    (select
    a.office
    ,b.name as office_name
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join lib_office b					on a.office = b.ref
    where a.year = "2562"
    group by a.office
    order by a.office) a
    left join 
    (
    select
    office
    ,sum(budget_approve) as budget_approve61
    from budget61.sum_budget_item
    group by office
    ) c										on a.office = c.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'OFFICE'
    group by office
    order by office
    ) d										on a.office = d.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'FINAL'
    group by office
    order by office
    ) e									on a.office = e.office`;

    let sql63 = `
    select
    a.office
    ,a.office_name
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
    from
    (select
    a.office
    ,b.name as office_name
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join lib_office b					on a.office = b.ref
	where a.year = "${fiscal_year}"
    group by a.office
    order by a.office) a
    left join 
    (
    select
    office
    ,sum(budget_approve) as budget_approve61
    from budget62.sum_budget_item
	where year = "${fiscal_year-1}"
    group by office
    ) c										on a.office = c.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'OFFICE'
		and year = "${fiscal_year-1}"
    group by office
    order by office
    ) d										on a.office = d.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'FINAL'
	and year = "${fiscal_year-1}"
    group by office
    order by office
    ) e									on a.office = e.office`;

    if(fiscal_year > 2562){
      return knex.raw(sql63);
    }else {
      return knex.raw(sql62);
    }
    
  }


  reportRequestDetailByItem(knex: Knex, item: string, fiscal_year:number, offset: number = 0) {
    let sql62 = `select
    a.office
    ,a.office_name
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
    from
    (select
    a.office
    ,b.name as office_name
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join lib_office b					on a.office = b.ref
    where item = "${item}"
    a.year = "${fiscal_year-1}"
    group by a.office
    order by a.office) a
    left join 
    (
    select
    office
    ,sum(budget_approve) as budget_approve61
    from budget61.sum_budget_item
    where item = "${item}"
    group by office
    ) c										on a.office = c.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'OFFICE'
    and item = "${item}"
    group by office
    order by office
    ) d										on a.office = d.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'FINAL'
    and item = "${item}"
    group by office
    order by office
    ) e									on a.office = e.office`;

    let sql63 = `select
    a.office
    ,a.office_name
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
    from
    (select
    a.office
    ,b.name as office_name
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join lib_office b					on a.office = b.ref
    where item = "${item}"
    and a.year = "${fiscal_year}"
    group by a.office
    order by a.office) a
    left join 
    (
    select
    office
    ,sum(budget_approve) as budget_approve61
    from budget62.sum_budget_item
    where item = "${item}"
    and year = "${fiscal_year-1}"
    group by office
    ) c										on a.office = c.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'OFFICE'
    and item = "${item}"
    and year = "${fiscal_year-1}"
    group by office
    order by office
    ) d										on a.office = d.office
    left join
    (
    select
    office
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'FINAL'
    and item = "${item}"
    and year = "${fiscal_year-1}"
    group by office
    order by office
    ) e									on a.office = e.office`;

    if(fiscal_year > 2562){
      console.log(sql63);
      return knex.raw(sql63);
    }else {
      return knex.raw(sql62);
    }
  }

  reportRequestGroupByItem(knex: Knex,fiscal_year: number, offset: number = 0) {
    let sql62 = `select
    a.item
    ,a.detail
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
    from
    (select
    a.item
    ,b.detail
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join budget62.view_budget_item b					on a.item = b.item
    where a.year = "${fiscal_year-1}"
    group by a.item
    order by a.item) a
    left join 
    (
    select
    item
    ,sum(budget_approve) as budget_approve61
    from budget61.sum_budget_item
    group by item
    ) c										on a.item = c.item
    left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'OFFICE'
    group by item
    order by item
    ) d										on a.item = d.item
    left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'FINAL'
    group by item
    order by item
    ) e									on a.item = e.item`;

    let sql63 = `
    select
    a.item
    ,a.detail
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
    from
    (select
    a.item
    ,b.detail
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join budget62.view_budget_item b					on a.item = b.item
	where a.year = "${fiscal_year}"
    group by a.item
    order by a.item) a
    left join 
    (
    select
    item
    ,sum(budget_approve) as budget_approve61
    from budget62.sum_budget_item
	where year = "${fiscal_year-1}"
    group by item
    ) c										on a.item = c.item
    left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'OFFICE'
	and year = "${fiscal_year-1}"
    group by item
    order by item
    ) d										on a.item = d.item
    left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'FINAL'
	and year = "${fiscal_year-1}"
    group by item
    order by item
    ) e									on a.item = e.item
    `;
  
    if(fiscal_year > 2562){
      return knex.raw(sql63);
    }else {
      return knex.raw(sql62);
    }
  
  }

async reportRequestDetailByOffice(knex: Knex, office:any, fiscal_year:any ,offset: number = 0) {

let sql62 = `
select 
	a.item
    ,a.detail
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
from
(select
    a.item
    ,b.detail
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join budget62.view_budget_item b					on a.item = b.item
  where office = "${office}"
  and year = "${fiscal_year-1}"
	group by a.item
    order by a.item
) a 	
left join 
    (
    select
    item
    ,sum(budget_approve) as budget_approve61
    from budget61.sum_budget_item
	where office = "${office}"
    group by item
) c										on a.item = c.item
left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'OFFICE'
	and office = "${office}"
    group by item
    order by item
    ) d										on a.item = d.item
left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget61.budget_used
    where type = 'FINAL'
	and office = "${office}"

    group by item
    order by item
    ) e									on a.item = e.item
    order by a.item
`;

let sql63 = `
select 
	a.item
    ,a.detail
    ,if(c.budget_approve61 is null,0,c.budget_approve61) as budget_approve61
    ,if(d.real_use is null,0,d.real_use) as real_use61
    ,if(e.real_use is null,0,e.real_use) as final_use61
    ,if(a.budget is null,0,a.budget) as budget_request
    ,if(a.budget1 is null,0,a.budget1) as budget1
    ,if(a.budget2 is null,0,a.budget2) as budget2
    ,if(a.budget3 is null,0,a.budget3) as budget3
    ,if(a.budget4 is null,0,a.budget4) as budget4
    ,if(a.budget5 is null,0,a.budget5) as budget5
    ,if(a.budget_approve is null,0,a.budget_approve) as budget_approve
from
(select
    a.item
    ,b.detail
    ,sum(a.budget) as budget
    ,sum(a.budget1) as budget1
    ,sum(a.budget2) as budget2
    ,sum(a.budget3) as budget3
    ,sum(a.budget4) as budget4
    ,sum(a.budget5) as budget5
    ,sum(a.budget_approve) as budget_approve
    from budget62.sum_budget_item a
    left join budget62.view_budget_item b					on a.item = b.item
	where office = "${office}"
	and a.year = "${fiscal_year}"
	group by a.item
    order by a.item
) a 	
left join 
    (
    select
    item
    ,sum(budget_approve) as budget_approve61
    from budget62.sum_budget_item
	where office = "${office}"
	and year = "${fiscal_year-1}"
    group by item
) c										on a.item = c.item
left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'OFFICE'
	and office = "${office}"
	and year = "${fiscal_year-1}"
    group by item
    order by item
    ) d										on a.item = d.item
left join
    (
    select
    item
    ,type
    ,sum(real_use) as real_use
    from budget62.budget_used
    where type = 'FINAL'
	and office = "${office}"
	and year = "${fiscal_year-1}"
    group by item
    order by item
    ) e									on a.item = e.item
    order by a.item
`

  if(fiscal_year > 2562){
    return knex.raw(sql63);
  }else {
    return knex.raw(sql62);
  }
  
  }


  reportRequestDetailByOfficeNogroup(knex: Knex, office:string,fiscal_year:number, offset: number = 0) {
    let sql = `
    SELECT		data_budget.office
    ,data_budget.office_name
    ,data_budget.item
    ,data_budget.type
    ,data_budget.itemname
    ,data_budget.totalprice
    ,data_budget.approve
    FROM
    (
    SELECT			a.office,c.name	AS	office_name
    ,a.item 	AS 	item
    ,b.detail	AS	type
    ,a.reason	AS	itemname
    ,a.budget	AS	totalprice
    ,a.budget_adj_final as approve
    ,a.year
    ,1		AS	ord
    FROM				budget62.budget_job		a
    LEFT JOIN		budget62.view_budget_item		b		ON		a.item	=	b.item
    LEFT JOIN		budget62.lib_office		c		ON		a.office	=	c.ref
    
    UNION	ALL
    
    SELECT		a.office,b.name	AS	office_name
    ,'010202' 	AS 	item
    ,'ค่าจ้างลูกจ้างชั่วคราว/พนักงานกระทรวงสาธารณสุข (จ้างเพิ่ม/ทดแทน)'			AS 	type
    ,a.detail	AS	itemname
    ,a.totalprice
    ,a.totalprice_approve_final as approve
    ,a.year
    ,2		AS	ord
    FROM			budget62.budget_personal		a
    LEFT JOIN	budget62.lib_office		b		ON		a.office	=	b.ref
    
    UNION	ALL
    
    SELECT			a.office,f.name	AS	office_name
    ,CASE		a.typeasset
    WHEN		'MED'		THEN	'030207'
    WHEN		'GEN'		THEN	'030201'
    WHEN		'COM'		THEN	'030208'
    ELSE		a.item
    END			AS		item
    ,CASE		a.typeasset
    WHEN		'MED'		THEN	'ครุภัณฑ์การแพทย์'
    WHEN		'GEN'		THEN	'ครุภัณฑ์สำนักงาน'
    WHEN		'COM'		THEN	'ครุภัณฑ์คอมพิวเตอร์'
    WHEN		'OTH'		THEN	e.item
    ELSE		a.typeasset
    END			AS		type
    ,IF (a.item	=	'9999',a.item_name,IF(a.typeasset	=	'MED',d.item,IF(a.typeasset	=	'GEN',c.item,IF(a.typeasset = 'COM',b.item,IF(a.typeasset	=	'OTH',a.item_name,a.item)))))	AS	itemname
    ,a.totalprice
    ,a.totalprice_adj2 as approve
    ,a.year
    ,3		AS	ord
    FROM				budget62.budget_fixasset			a
    LEFT JOIN		budget62.lib_com				b		ON		a.item	=	b.ref
    LEFT JOIN		budget62.lib_gen				c		ON		a.item	=	c.ref
    LEFT JOIN		budget62.lib_med				d		ON		a.item	=	d.ref
    LEFT JOIN		budget62.lib_oth				e		ON		a.item	=	e.ref
    LEFT JOIN		budget62.lib_office		f		ON		a.office	=	f.ref
    
    UNION	ALL
    
    SELECT			a.office	
    ,b.name	AS	office_name		
    ,CASE		a.type
    WHEN		'ADJUST'		THEN	'030101'
    WHEN		'REPAIR'		THEN	'030101'
    WHEN		'BUILD'			THEN	'030101'
    WHEN		'EXPAND'		THEN	'030101'
    ELSE		a.type
    END			AS		item
    ,c.detail	AS	type
    ,a.item	AS	itemname
    ,a.totalprice
    ,a.totalprice_adj2 as approve
    ,a.year
    ,4		AS	ord
    FROM				budget62.budget_buildingrepair			a
    LEFT JOIN		budget62.lib_office		b		ON		a.office	=	b.ref
    LEFT JOIN		budget62.lib_building	c		ON		a.type		=	c.ref
    
    UNION		ALL
    
    SELECT				a.office	,b.name		AS		office_name
    ,'1001'			AS 	item
    ,'โครงการเพื่อการพัฒนา'		AS	type
    ,a.topic	AS	itemname
    ,a.budget		AS		totalprice
    ,a.budget_approve_final as approve
    ,a.year
    ,5		AS	ord
    FROM					budget62.budget_project		a
    LEFT JOIN			budget62.lib_office		b		ON		a.office	=	b.ref
    
    )	AS	data_budget
    where data_budget.office = ${office} and data_budget.year = ${fiscal_year}
    ORDER BY		data_budget.item,data_budget.type
    `;

    return knex.raw(sql);
    //   const results = await knex.raw(sql);
    // return results[0];
  }


  reportUsedByItem(knex: Knex, fiscal_year: number){
    let sql = `
    select 
      d.item
      ,d.detail
      -- ,if(a.item = '1001','โครงการเพื่อการพัฒนา',c.detail) as detail
      ,b.budget_approve
      ,sum(if(a.type='OFFICE',a.budget,0)) as sum_office
      ,sum(if(a.type='PROCURE',a.budget,0)) as sum_procure
      ,sum(if(a.type='FINAL',a.budget,0)) as sum_final

      from 
      budget62.view_budget_item d
      left join 
      (
        select typeasset,item,sum(budget_approve) as budget_approve
        from budget62.sum_budget_item
        group by item
      )b on d.item = b.item
      left join (select * from budget62.budget_used where item !='1001') a	on d.item = a.item
      left join budget62.view_budget_item c 	ON	d.item = c.item
      -- where a.item != '1001'
      where a.year = "${fiscal_year}"
      group by d.item
      having budget_approve >0
    `;
    return knex.raw(sql);
  }

  reportUsedByOffice(knex: Knex, fiscal_year: number){
    let sql = `
    select 
    d.ref
    ,d.name
    ,b.budget_approve
    ,sum(if(a.type='OFFICE',a.budget,0)) as sum_office
    ,sum(if(a.type='PROCURE',a.budget,0)) as sum_procure
    ,sum(if(a.type='FINAL',a.budget,0)) as sum_final

    from 
    (select * from budget62.lib_office where budget_office = 1 and LENGTH(ref) >2) d
    left join (select * from budget62.budget_used where item !='1001') a 	on d.ref = a.office
    left join 
    (
      select typeasset,office,sum(budget_approve) as budget_approve
      from budget62.sum_budget_item
      group by office
    )b on d.ref = b.office
    where a.year = "${fiscal_year}"
    group by d.ref
    having budget_approve >0
    `;
    return knex.raw(sql);
  }


  listOT(knex: Knex, item: string, fiscal_year:number, offset: number = 0) {
    return knex('budget62.view_budget_job_approve')
      .where({
        item: item,
        year: fiscal_year,
      })
      .orderBy('office')
      .offset(offset);
  }

  listProject(knex: Knex, fiscal_year:number, offset: number = 0) {
    return knex('budget62.view_budget_project')
      .where({
        year: fiscal_year,
      })
      .orderByRaw('office,ref')
      // .orderBy('office')
      .offset(offset);
  }

  listAsset(knex: Knex, category: string,fiscal_year:number, offset: number = 0) {
    return knex('budget62.view_budget_fixasset_withcategory')
      .where({
        category: category,
        year: fiscal_year,
      })
      .orderBy('office')
      .offset(offset);
  }
  listBuilding(knex: Knex, type: string,fiscal_year:number, offset: number = 0) {
    return knex('budget62.view_budget_buildingrepair_withcode_approve')
      .where({
        type_code: type,
        year: fiscal_year,
      })
      .orderBy('office')
      .offset(offset);
  }

  listPersonal(knex: Knex,fiscal_year:number, offset: number = 0) {
    return knex('budget62.view_budget_personal')
      .where({
        year: fiscal_year,
      })
      .orderBy('office')
      .offset(offset);
  }

  reportApproveByItem(knex: Knex,fiscal_year:number, offset: number = 0) {
    let sql = `
    select 
    budget62.view_request.year,
    budget62.view_request.type,
    budget62.view_request.item,
    if(budget62.view_request.item = '1001','โครงการเพื่อการพัฒนา',budget62.view_budget_item.detail) as item_name,
    sum(if(budget62.view_request.budget_type=1,budget62.view_request.budget_approve,0)) as budget1,
    sum(if(budget62.view_request.budget_type=2,budget62.view_request.budget_approve,0)) as budget2,
    sum(if(budget62.view_request.budget_type=3,budget62.view_request.budget_approve,0)) as budget3,
    sum(if(budget62.view_request.budget_type=4,budget62.view_request.budget_approve,0)) as budget4,
    sum(if(budget62.view_request.budget_type=5,budget62.view_request.budget_approve,0)) as budget5,
    sum(if(budget62.view_request.budget_type=8,budget62.view_request.budget_approve,0)) as budget8,
    sum(if(budget62.view_request.budget_type=11,budget62.view_request.budget_approve,0)) as budget11,
    sum(if(budget62.view_request.budget_type=99,budget62.view_request.budget_approve,0)) as budget99,
    sum(budget62.view_request.budget_approve) as budget_approve
    from budget62.view_request 
    left join
    budget62.view_budget_item on budget62.view_request.item = budget62.view_budget_item.item
    where view_request.year = "${fiscal_year}"
    group by budget62.view_request.item`;
    return knex.raw(sql);
  }

  

  

  

}