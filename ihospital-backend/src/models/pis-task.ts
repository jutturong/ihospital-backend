import Knex = require('knex');
import * as moment from 'moment';

export class PisTaskModel {

  public tableName  = 'hospdata.pis_task_order';
  public primaryKey = 'ref';

  listTaskOrder(knex: Knex,office: string, offset: number = 0) {
    return knex('hospdata.view_pis_task_order')
      .where('office',office)
      .orderBy('ref','desc')
      .offset(offset);
  }

  listTaskOrderQuery(knex: Knex,office: string ,q='',filterby = 'name', offset = 0) {
    let query = knex('hospdata.view_pis_task_order')
      .orderBy('ref','desc')
      .offset(offset);
      if(q==''){
        return query.where('office',office);
      }
      if(filterby == 'name'){
        return query.where({
          inp_id : q,
          office : office
        });
      } else if (filterby == 'completed') {
        return query.where({
          finish : q,
          office : office
        });
      } else {
        return query.where('activity','like','%' + q + '%')
        .andWhere('office',office);
      }
  }

  listTaskOrderByItem(knex: Knex, ref:string ,offset: number = 0) {
    return knex('hospdata.view_pis_task_order')
      .where('ref',ref)
      .orderBy('ref')
      .offset(offset);
  }

  listTaskOrderItem(knex: Knex, task: number, offset: number = 0) {
    return knex('hospdata.view_pis_task_order_item')
      .where('task',task)
      .orderBy('ref')
      .offset(offset);
  }

  listTaskOrderItemAll(knex: Knex, offset: number = 0) {
    return knex('hospdata.view_pis_task_order_item')
      .orderBy('ref')
      .offset(offset);
  }

  listOffice(knex: Knex, offset: number = 0) {
    return knex('hospdata.lib_office')
      .whereRaw('isactive = 1')
      .orderBy('ref')
      .offset(offset);
  }
  listJobType(knex: Knex, offset: number = 0) {
    return knex('hospdata.lib_job_type')
      .where('active','Y')
      .orderBy('code')
      .offset(offset);
  }
  listJobLocation(knex: Knex, offset: number = 0) {
    return knex('hospdata.lib_job_location')
      .where('active','Y')
      .orderBy('code')
      .offset(offset);
  }
  
  listRisk(knex: Knex,group: string, offset: number = 0) {
    return knex('hospdata.lib_risk')
      .where('group',group)
      .orderBy('code')
      .offset(offset);
  }

  listRiskType(knex: Knex,ref_risk: string, offset: number = 0) {
    return knex('hospdata.lib_risk_type')
      .where('ref_risk',ref_risk)
      .orderBy('code')
      .offset(offset);
  }

  listRiskDetail(knex: Knex, ref_risk: string, ref_type: string, offset: number = 0) {
    return knex('hospdata.lib_risk_detail')
      .where({
        'ref_risk': ref_risk,
        'ref_type': ref_type})
      .orderBy('code')
      .offset(offset);
  }

  listEmployee(knex: Knex, office :string, offset: number = 0) {
    return knex('hospdata.employee')
    // .where('department',office)
    .whereRaw('department= ? and (expire ="0000-00-00" or expire is null or expire = "")',[office])
    .orderBy('code','asc')
    .offset(offset);
  }

  listEmployeeReport(knex: Knex, office :string, date_start: string, date_end: string, offset: number = 0) {
    let sql = `
    select 
      title
      ,name
      ,surname
      ,sum(if(type=2,1,0)) as job_count
      ,sum(if(type=1,1,0)) as risk_count
      ,count(*) as total
    from hospdata.view_pis_task_order
    where finish = 'Y'
    and office = ${office}
    and date_order between '${date_start} 00:00:00' and '${date_end} 23:59:59'
    GROUP BY inp_id
    `
    return knex.raw(sql);
    
  }

  listOfficeReport(knex: Knex, office :string, date_start: string, date_end: string, offset: number = 0) {
    let sql = `
    select 
      if(office_order!='',office_order,'9999') as office_order
      ,if(office_order_txt !='',office_order_txt,'อื่นๆ') as office_order_txt
      ,sum(if(type=2,1,0)) as job_count
      ,sum(if(type=1,1,0)) as risk_count
      ,count(*) as total
    from hospdata.view_pis_task_order
    where finish = 'Y'
    and office = ${office}
    and date_order between '${date_start} 00:00:00' and '${date_end} 23:59:59'
    GROUP BY office_order
    order by office_order
    `
    return knex.raw(sql);
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  saveItem(knex: Knex, datas: any) {
    return knex('hospdata.pis_task_order_item')
      .insert(datas);
  }

  updateItem(knex: Knex, id: string, datas: any) {
    return knex('hospdata.pis_task_order_item')
      .where(this.primaryKey, id)
      .update(datas);
  }
  update(knex: Knex, id: string, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
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