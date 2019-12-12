import Knex = require('knex');
import * as moment from 'moment';

export class UsedModel {

  public tableName = 'budget62.budget_used';
  public primaryKey = 'ref';

  listGeneralEx(knex: Knex,office: string , offset: number = 0) {
    return knex('budget62.view_budget_job')
    .where( 'office',office)
    .whereRaw('budget_adj_final>0')
    .orderBy('item')
    .offset(offset);
  }

  listProjectByRef(knex: Knex,ref: number , offset: number = 0) {
    return knex('budget62.budget_project')
    .where( 'ref',ref)
    .offset(offset);
  }

  listItemDetail(knex: Knex, ref : number, office: string, type : string, item: string, fiscal_year:number, offset: number = 0) {
    return knex('budget62.view_budget_used_withapprove')
      .where({
        ref: ref,
        type: type,
        office: office,
        item: item,
        year: fiscal_year,
      })
      .orderBy('no','desc')
      .offset(offset);
  }

  listGeneral(knex: Knex,office: string,fiscal_year:number, offset: number = 0) {
    let sql = `
    select *
    from
    (select 
    a.ref
    ,a.office
    ,a.office_name 
    ,a.item
    ,a.budget_detail
    ,a.budget_adj_final
    ,a.budget_type
    ,a.budget_type_name
    ,b.sum_budget as sum_budget_office
    ,b.sum_real_use as sum_real_use_office
    ,c.sum_budget as sum_budget_procure
    ,c.sum_real_use as sum_real_use_procure
    ,d.sum_budget as sum_budget_final
    ,d.sum_real_use as sum_real_use_final
    from budget62.view_budget_job a
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = "${office}"
	and year = "${fiscal_year}"
    and type = 'OFFICE'
    and item != '1001' and item not like '03%'
    GROUP BY ref
    )b			on a.ref = b.ref and a.item = b.item
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = ${office}
	and year = "${fiscal_year}"
    and type = 'PROCURE'
    and item != '1001' and item not like '03%'
    GROUP BY ref
    )c			on a.ref = c.ref and a.item = c.item
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office =  ${office}
	and year = "${fiscal_year}"
    and item != '1001' and item not like '03%'
    and type = 'FINAL'
    GROUP BY ref
    )d			on a.ref = d.ref and a.item = d.item
    where a.office = ${office} and year = "${fiscal_year}" and a.budget_adj_final>0
	
	UNION
	
	select a.ref
  ,a.office
  ,a.office_name
  ,a.item
  ,'ค่าจ้างลูกจ้างชั่วคราว/พนักงานกระทรวงสาธารณสุข(จ้างเพิ่ม/ทดแทน)' as budget_detail
  ,a.totalprice_approve_final as budget_adj_final
  ,a.budget_type
  ,a.budget_type_name
  ,b.sum_budget as sum_budget_office
  ,b.sum_real_use as sum_real_use_office
  ,c.sum_budget as sum_budget_procure
  ,c.sum_real_use as sum_real_use_procure
  ,d.sum_budget as sum_budget_final
  ,d.sum_real_use as sum_real_use_final
  from budget62.view_budget_personal_approve a 
  left join
      (
      select no
      ,ref
      ,office
      ,type
      ,item 
      ,sum(budget) as sum_budget
      ,sum(real_use) as sum_real_use
      from budget62.budget_used 
      where office = ${office}
		and year = "${fiscal_year}"
      and type = 'OFFICE'
      and item != '1001' and item not like '03%'
      GROUP BY ref
      )b			on a.ref = b.ref and a.item = b.item
      left join
      (
      select no
      ,ref
      ,office
      ,type
      ,item 
      ,sum(budget) as sum_budget
      ,sum(real_use) as sum_real_use
      from budget62.budget_used 
      where office = ${office}
	 and year = "${fiscal_year}"
      and item != '1001' and item not like '03%'
      and type = 'PROCURE'
      GROUP BY ref
      )c			on a.ref = c.ref and a.item = c.item
      left join
      (
      select no
      ,ref
      ,office
      ,type
      ,item 
      ,sum(budget) as sum_budget
      ,sum(real_use) as sum_real_use
      from budget62.budget_used 
      where office = ${office}
	and year = "${fiscal_year}"
      and item != '1001' and item not like '03%'
      and type = 'FINAL'
      GROUP BY ref
      )d			on a.ref = d.ref and a.item = d.item
    where a.office = ${office}
    and a.item != '1001' and a.item not like '03%'
    and a.totalprice_approve_final>0
    ) a
    order by a.item
   
    `
    return knex.raw(sql);
  }

  listFixasset(knex: Knex,office: string,fiscal_year:number, offset: number = 0) {

    let sql = `
    select 
    a.ref
    ,a.office
    ,a.office_name
    ,a.budget_type
    ,a.budget_type_detail
    ,a.typeasset
    ,a.category
    ,IF (a.item	=	'9999',a.item_name,IF(a.typeasset	=	'MED',d.item,IF(a.typeasset	=	'GEN',c.item,IF(a.typeasset = 'COM',b.item,IF(a.typeasset	=	'OTH',a.item_name,a.item)))))	AS	itemname
    ,a.no_adj2
    ,a.price_adj2
    ,a.totalprice_adj2
    ,a.detail
    ,IF(a.type = 'N','ใหม่','ทดแทน') as type
    ,g.sum_budget as sum_budget_office
    ,g.sum_real_use as sum_real_use_office
    ,h.sum_budget as sum_budget_procure
    ,h.sum_real_use as sum_real_use_procure
    ,i.sum_budget as sum_budget_final
    ,i.sum_real_use as sum_real_use_final
    from budget62.view_budget_fixasset_withcategory a
    LEFT JOIN		budget62.lib_com				b		ON		a.item	=	b.ref
    LEFT JOIN		budget62.lib_gen				c		ON		a.item	=	c.ref
    LEFT JOIN		budget62.lib_med				d		ON		a.item	=	d.ref
    LEFT JOIN		budget62.lib_oth				e		ON		a.item	=	e.ref
    LEFT JOIN		budget62.lib_office		f		ON		a.office	=	f.ref
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = ${office}
    and year = "${fiscal_year}"
    and item != '1001' and item not like '02%' and item not like '01%'
    and type = 'OFFICE'
    GROUP BY ref
    )g			on a.ref = g.ref and a.category = g.item
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = ${office}
    and year = "${fiscal_year}"
    and item != '1001' and item not like '02%' and item not like '01%'
    and type = 'PROCURE'
    GROUP BY ref
    )h			on a.ref = h.ref and a.category = h.item
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = ${office}
    and year = "${fiscal_year}"
    and item != '1001' and item not like '02%' and item not like '01%'
    and type = 'FINAL'
    GROUP BY ref
    )i			on a.ref = i.ref and a.category = i.item
    where a.office = ${office}
    and year = "${fiscal_year}"
    and a.item != '1001' and a.item not like '02%' and a.item not like '01%'
    and a.totalprice_adj2>0
    order by a.category,a.ref asc
    `;

    return knex.raw(sql);

  }

  listBuilding(knex: Knex,office: string,fiscal_year:number, offset: number = 0) {
    
      let sql = `
      select a.*
      ,b.sum_budget as sum_budget_office
      ,b.sum_real_use as sum_real_use_office
      ,c.sum_budget as sum_budget_procure
      ,c.sum_real_use as sum_real_use_procure
      ,d.sum_budget as sum_budget_final
      ,d.sum_real_use as sum_real_use_final
    from budget62.view_budget_buildingrepair_withcode_approve a
    left join
      (
      select no
      ,ref
      ,office
      ,type
      ,item 
      ,sum(budget) as sum_budget
      ,sum(real_use) as sum_real_use
      from budget62.budget_used 
      where office = ${office}
	 and year = "${fiscal_year}"
      and type = 'OFFICE'
      GROUP BY ref
      )b			on a.ref = b.ref and a.type_code = b.item
      left join
      (
      select no
      ,ref
      ,office
      ,type
      ,item 
      ,sum(budget) as sum_budget
      ,sum(real_use) as sum_real_use
      from budget62.budget_used 
      where office = ${office}
	and year = "${fiscal_year}"
      and type = 'PROCURE'
      GROUP BY ref
      )c			on a.ref = c.ref and a.type_code = c.item
      left join
      (
      select no
      ,ref
      ,office
      ,type
      ,item 
      ,sum(budget) as sum_budget
      ,sum(real_use) as sum_real_use
      from budget62.budget_used 
      where office = ${office}
	  and year = "${fiscal_year}"
      and type = 'FINAL'
      GROUP BY ref
      )d			on a.ref = d.ref and a.type_code = d.item
      where a.office = ${office}
	  and year = "${fiscal_year}"
      and a.totalprice_adj2>0
      order by a.type_code
      `;
      console.log(sql);
      return knex.raw(sql);
  }

  listProject(knex: Knex,office: string,fiscal_year:number , offset: number = 0) {
    let sql = `
    select a.*
	  ,b.sum_budget as sum_budget_office
    ,b.sum_real_use as sum_real_use_office
    ,c.sum_budget as sum_budget_procure
    ,c.sum_real_use as sum_real_use_procure
    ,d.sum_budget as sum_budget_final
    ,d.sum_real_use as sum_real_use_final
    from budget62.view_budget_project a
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = ${office}
    and year = "${fiscal_year}"
    and item = '1001'
    and type = 'OFFICE'
    GROUP BY ref
    )b			on a.ref = b.ref and a.item = b.item
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = ${office}
    and year = "${fiscal_year}"
    and item = '1001'
    and type = 'PROCURE'
    GROUP BY ref
    )c			on a.ref = c.ref and a.item = b.item
    left join
    (
    select no
    ,ref
    ,office
    ,type
    ,item 
    ,sum(budget) as sum_budget
    ,sum(real_use) as sum_real_use
    from budget62.budget_used 
    where office = ${office}
    and year = "${fiscal_year}"
    and item = '1001'
    and type = 'FINAL'
    GROUP BY ref
    )d			on a.ref = d.ref and a.item = b.item
    where a.office = ${office}
    and a.year = "${fiscal_year}"
    and a.item = '1001'
    and a.budget_approve_final>0
    order by a.ref
    `;
    return knex.raw(sql);
  }

  getPrevUsed(knex: Knex, no:number ,ref : number, office: string, type : string, offset: number = 0){
    let sql = `
      select sum(real_use) as prev_real_use
      from budget62.budget_used
      where 
      ref = ${ref}
      and office = ${office}
      and type = ${type}
      and no < ${no}
    `;

    return knex.raw(sql);
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }


  update(knex: Knex, id: string, datas: any) {
    return knex(this.tableName)
      .where('no', id)
      .update(datas);
  }


  detail(knex: Knex, id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, id);
  }

  remove(knex: Knex, id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
      .del();
  }

}