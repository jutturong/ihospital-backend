import Knex = require('knex');
import * as moment from 'moment';

export class LoginModel {
  doLogin(knex: Knex, username: string, password: string) {
    return knex('mydb.user')
      .select('user.*', 'e.code as employee_code',
        'e.no as employeeno', 'e.department')
      .leftJoin('payroll.employee as e', 'user.employee_no', 'e.id')
      .where('user.username', username)
      .where('user.encr', password)
      .limit(1);
  }

  loginOldUser(knex: Knex, username: string, password: string) {
    let sql = `SELECT * FROM payroll.employee WHERE UPPER(id)="${username.toUpperCase()}" ` +
      ` AND passwd=old_password("${password}") LIMIT 1`;
    return knex.raw(sql);
  }

  doLoginOldUser(knex: Knex, username: string, password: string) {
    let sql = `SELECT * FROM payroll.employee WHERE UPPER(id)="${username.toUpperCase()}" ` +
      ` AND password=sha("${username.toUpperCase()}${password}") LIMIT 1`;
    return knex.raw(sql);
  }

  saveToken(knex: Knex, arrData) {
    return knex('mydb.login_token')
      .insert(arrData, 'token_id')
      .returning('token_id');
  }

  saveTokenEvent(knex: Knex, arrData) {
    return knex('mydb.login_token_event')
      .insert(arrData, 'event_id')
      .returning('event_id');
  }

  getToken(knex: Knex, token) {
    return knex('mydb.login_token')
      .select('*')
      .where('token', '=', token)
      .limit(1);
  }

  checkToken(knex: Knex, tokenKey, type = 'token') {
    if (!tokenKey) {
      return null;
    }
    return knex('mydb.login_token')
      .select('*')
      .where(type, '=', tokenKey)
      .limit(1);
  }

  getTrustee(knex: Knex, id, moduleName) {
    return knex('intranet.trustee')
      .select('*')
      .where({ id: id, module: moduleName, isactive: 1 })
      .limit(1);
  }

  getTrusteeByToken(knex: Knex, tokenKey, moduleName) {
    const today = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
    const sql = `SELECT m.module, m.detail as module_detail, m.level as module_level,
        trustee.level, trustee.office, trustee.default_depart, 
        trustee.default_unit, trustee.default_value, trustee.crud ,
        trustee.*,token.token, token.client_ip
      FROM mydb.login_token as token
        LEFT JOIN hospdata.trustee on token.employee_code = trustee.id
        LEFT JOIN hospdata.lib_pmodule m on trustee.module=MD5(m.module)
      WHERE token.token="${tokenKey}" and 
        token.expire>"${today}" and token.isactive=1 and
        trustee.isactive=1 and m.module="${moduleName}"  `;
    return knex.raw(sql);
  }

  getActiveToken(knex: Knex, token) {
    const today = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
    return knex('mydb.login_token as token')
      .leftJoin('mydb.user', 'token.user_id', 'user.id')
      .leftJoin('intranet.employee', 'user.employee_no', 'employee.id')
      .select('employee.code as employee_id', 'employee.no as salary_no',
        'user.employee_no', 'user.prename', 'user.fname', 'user.lname',
        'user.personid', 'employee.position', 'employee.level as position_level',
        'employee.department', 'employee.expire as employee_expire',
        'employee.email', 'token.token', 'token.code as token_code',
        'token.created_at', 'token.expire')
      .where('token.token', '=', token)
      .where('token.isactive', '=', '1')
      .where('token.expire', '>=', today)
      .limit(1);
  }

  getModuleRole(knex: Knex, id = 0) {
    if (id === 0) {
      return null;
    }
    const sql = `SELECT m.module as modulename 
      FROM intranet.trustee t 
        INNER JOIN hospdata.lib_pmodule m ON t.module = md5(m.module)
      WHERE t.id=${id} AND t.level>0 AND t.isactive=1`;

    return knex.raw(sql);
  }

  getModuleRoleDetail(knex: Knex, id = 0, module = '') {
    if (id === 0) {
      return null;
    }
    let where = '';
    if (module !== '') {
      where = ` AND m.module="${module}" `;
    };

    const sql = `SELECT m.module as modulename,t.level, t.trust, t.office, 
        t.default_depart, t.default_unit, t.default_value,trusted, t.crud 
      FROM intranet.trustee t 
        INNER JOIN hospdata.lib_pmodule m ON t.module = md5(m.module)
      WHERE t.id=${id} AND t.level>0 AND t.isactive=1 ${where}`;
    return knex.raw(sql);
  }
}
