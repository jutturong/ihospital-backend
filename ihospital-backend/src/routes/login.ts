'use strict';

import * as express from 'express';
import * as crypto from 'crypto';
import * as moment from 'moment';

import { IConnection } from 'mysql';
import { Jwt } from '../models/jwt';
import { LoginModel } from '../models/login';

const router = express.Router();
const loginModel = new LoginModel();
const jwt = new Jwt();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

router.post('/', async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let moduleName = req.body.module || '';
  let hour = +req.body.hour || 12;
  hour = hour > 24 ? 24 : hour;

  const timenow = moment().locale('th').format('HH:mm:ss');
  if (username && password) {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    encPassword = crypto.createHash('sha256').update(encPassword + username).digest('hex');
    let db = req.dbHospData;
    loginModel.doLogin(db, username, encPassword)
      .then(async (results: any) => {
        if (results.length > 0) {

          const roles = [];
          loginModel.getModuleRole(db, +results[0].employee_code)
            .then((results: any) => {
              if (results[0].length > 0) {
                const ro = results[0];
                ro.forEach(e => {
                  roles.push(e.modulename);
                });
              }
            });

          const today = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
          let expireDate = moment(today).add(hour, 'hours').format('YYYY-MM-DD HH:mm:ss');
          let tokenKey = crypto.createHash('md5').update(today).digest('hex') +
            crypto.createHash('md5').update(expireDate + username).digest('hex')
              .substring(10, 8);
          let userInfo = {
            employeeNo: results[0].employeeno,
            prename: results[0].prename,
            fname: results[0].fname,
            lname: results[0].lname,
            employeeCode: +results[0].employee_code,
            userId: results[0].id,
            userLevel: results[0].userlevel,
            personId: results[0].personid,
            position: results[0].position,
            positionType: results[0].position_type,
            department: results[0].department,
            licenseNo: results[0].license_no,
            userEmail: results[0].email,
            userTel: results[0].tel,
            defaultOffice: results[0].default_office,
            userMobile: results[0].mobile,
            UserExpire: results[0].blocked_at,
            tokenKey: tokenKey,
            tokenId: 0,
            tokenCreate: today,
            tokenExpire: expireDate,
            module: moduleName
          };

          var ip = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress) + '';
          if (ip.search(':') !== -1 && ip.search('.') !== -1) {
            let addr = ip.split(':');
            ip = addr[3];
          }
          var ua = req.header('user-agent');

          const tokenEnc = {
            oldUser: 0,
            u: results[0].id,
            uid: results[0].employee_code,
            employeeNo: results[0].employeeno,
            fullName: results[0].prename + results[0].fname + ' ' + results[0].lname,
            position: results[0].position,
            positionType: results[0].position_type,
            department: results[0].department,
            licenseNo: results[0].license_no,
            tokenKey: tokenKey,
            tokenCreate: today,
            tokenExpire: expireDate,
            roles: roles
          };
          const token = jwt.sign(tokenEnc, hour + 'h');
          const resultToken: any = await loginModel.saveToken(db, {
            created_at: today,
            user_id: results[0].id,
            employee_code: results[0].employee_code,
            employee_id: results[0].employee_no,
            code: token,
            client_agent: ua,
            client_ip: ip,
            expire: expireDate,
            token: tokenKey
          });
          if (resultToken) {
            userInfo.tokenId = resultToken[0];
            console.log('token id: ' + userInfo.tokenId);
          } else {
            console.log('save token error: ', resultToken);
          }

          if (moduleName && moduleName !== '') {
            let moduleTrustee = crypto
              .createHash('md5')
              .update(moduleName)
              .digest('hex');
            await loginModel.getTrustee(db, results[0].id, moduleTrustee)
              .then((trusteeResult: any) => {
                userInfo['roles'] = roles;
                if (trusteeResult && trusteeResult.length > 0) {
                  const row = trusteeResult[0];
                  const trustee = {
                    module: moduleName,
                    level: row.level,
                    trust: row.trust,
                    office: row.office,
                    default_depart: row.default_depart,
                    default_unit: row.default_unit,
                    default_value: row.default_value,
                    trusted: row.trusted,
                    crud: row.crud,
                    remark: row.remark
                  };
                  res.send({ status: 200, ok: true, data: userInfo, trustee: trustee, token: token })
                } else {
                  res.send({ status: 200, ok: true, data: userInfo, token: token })
                }
                console.log(timenow + ' login user:' + username + ' success');
              });
          } else {
            userInfo['roles'] = roles;
            res.send({ status: 200, ok: true, data: userInfo, token: token })
          }
        } else {
          console.log(timenow + ' login user:' + username + ' fail! (1)');
          res.send({ status: 400, ok: false, message: 'ชื่อผู้ใช้งานหรือรหัสผ่าน ไม่ถูกต้อง' })
        }
      })
      .catch(err => {
        console.log(timenow + ' login user:' + username + ' fail!! (2)', err);
        res.send({ status: 400, ok: false, message: 'Server error!' });
      })
      .finally(() => {
        db.destroy();
      });

  } else {
    res.send({ status: 400, ok: false, message: 'กรุณาระบุชื่อผู้ใช้งานและรหัสผ่าน' })
  }
})

router.post('/old-user', async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let moduleName = req.body.module || '';
  let hour = +req.body.hour || 12;
  hour = hour > 24 ? 24 : hour;

  const timenow = moment().locale('th').format('HH:mm:ss');
  if (username && password) {
    let db = req.dbHospData;
    loginModel.loginOldUser(db, username, password)
      .then(async (results: any) => {
        if (results[0].length > 0) {
          let rowUser = results[0][0];
          const today = moment().format('YYYY-MM-DD HH:mm:ss');
          let expireDate = moment(today).add(hour, 'hours').format('YYYY-MM-DD HH:mm:ss');
          let tokenKey = crypto.createHash('md5').update(today).digest('hex') + crypto
            .createHash('md5').update(expireDate + username).digest('hex').substring(10, 8);
          let userInfo = {
            prename: rowUser.title,
            fname: rowUser.name,
            lname: rowUser.surname,
            employeeCode: rowUser.code,
            employeeNo: rowUser.no,
            userId: rowUser.code,
            userLevel: 0,
            personId: rowUser.person_id,
            department: rowUser.department,
            userEmail: rowUser.email,
            userTel: rowUser.tel,
            defaultOffice: rowUser.department,
            userMobile: rowUser.tel_mobile,
            UserExpire: rowUser.expire,
            tokenKey: tokenKey,
            tokenId: 0,
            tokenExpire: expireDate,
            module: moduleName
          };
          let roles = [];
          const tokenEnc = {
            oldUser: 1,
            u: rowUser.id,
            uid: rowUser.code,
            employeeNo: rowUser.no,
            fullName: rowUser.title + rowUser.name + ' ' + rowUser.surname,
            position: rowUser.position,
            positionType: rowUser.pos_type,
            department: rowUser.department,
            licenseNo: rowUser.license_no,
            tokenKey: tokenKey,
            tokenCreate: today,
            tokenExpire: expireDate,
            roles: roles
          };
          const token = jwt.sign(tokenEnc, hour + 'h');

          const resultToken: any = await loginModel.saveToken(db, {
            created_at: today,
            user_id: 0,
            employee_code: rowUser.code,
            employee_id: rowUser.id,
            code: token,
            expire: expireDate,
            src_login: 0,
            token: tokenKey
          });
          if (resultToken) {
            userInfo.tokenId = resultToken[0];
            console.log('token id: ' + userInfo.tokenId);
          } else {
            console.log('save token error: ', resultToken);
          }

          if (moduleName && moduleName !== '') {
            let moduleTrustee = crypto.createHash('md5').update(moduleName).digest('hex');
            loginModel.getTrustee(db, rowUser.code, moduleTrustee)
              .then((trusteeResult: any) => {
                if (trusteeResult && trusteeResult.length > 0) {
                  const row = trusteeResult[0];
                  const trustee = {
                    module: moduleName,
                    level: row.level,
                    trust: row.trust,
                    office: row.office,
                    default_depart: row.default_depart,
                    default_unit: row.default_unit,
                    default_value: row.default_value,
                    trusted: row.trusted,
                    crud: row.crud,
                    remark: row.remark
                  };
                  res.send({ status: 200, ok: true, data: userInfo, trustee: trustee, token: token })
                } else {
                  res.send({ status: 200, ok: true, data: userInfo, token: token })
                }
              });
          } else {
            res.send({ status: 200, ok: true, data: userInfo, token: token })
          }
          console.log(timenow + ' login old user:' + rowUser.no + ' success');
        } else {
          console.log(timenow + ' login old user:' + username + ' fail! (1)');
          res.send({ status: 400, ok: false, message: 'ชื่อผู้ใช้งานหรือรหัสผ่าน ไม่ถูกต้อง' })
        }
      })
      .catch(err => {
        console.log(timenow + ' login old user:' + username + ' fail!! (2)', err);
        res.send({ status: 400, ok: false, message: 'Server error!' });
      })
      .finally(() => {
        db.destroy();
      });

  } else {
    res.send({ status: 400, ok: false, message: 'กรุณาระบุชื่อผู้ใช้งานและรหัสผ่าน' })
  }
})

router.post('/with-roles', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let moduleName = req.body.module || '';
  let hour = +req.body.hour || 12;
  hour = hour > 24 ? 24 : hour;

  if (username && password) {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    encPassword = crypto.createHash('sha256').update(encPassword + username).digest('hex');
    let db = req.dbHospData;
    loginModel.doLogin(db, username, encPassword)
      .then((results: any) => {
        if (results.length > 0) {
          const today = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
          let expireDate = moment(today).add(hour, 'hours').format('YYYY-MM-DD HH:mm:ss');
          let tokenKey = crypto.createHash('md5').update(today).digest('hex') +
            crypto.createHash('md5').update(expireDate + username).digest('hex')
              .substring(10, 8);
          let userInfo = {
            prename: results[0].prename,
            fname: results[0].fname,
            lname: results[0].lname,
            employeeCode: +results[0].employee_code,
            employeeNo: results[0].employee_no,
            userId: results[0].id,
            userLevel: results[0].userlevel,
            personId: results[0].personid,
            position: results[0].position,
            positionType: results[0].position_type,
            licenseNo: results[0].license_no,
            userEmail: results[0].email,
            userTel: results[0].tel,
            defaultOffice: results[0].default_office,
            userMobile: results[0].mobile,
            UserExpire: results[0].blocked_at,
            tokenKey: tokenKey,
            tokenId: 0,
            tokenCreate: today,
            tokenExpire: expireDate,
            module: moduleName
          };

          const roles = [];
          loginModel.getModuleRole(db, +results[0].employee_code)
            .then((results: any) => {
              if (results[0].length > 0) {
                const ro = results[0];
                ro.forEach(e => {
                  roles.push(e.modulename);
                });
              }
            });

          const tokenEnc = {
            u: results[0].id,
            uid: results[0].employee_code,
            fullName: results[0].prename + results[0].fname + ' ' + results[0].lname,
            employeeNo: results[0].employeeNo,
            tokenKey: tokenKey,
            tokenCreate: today,
            tokenExpire: expireDate,
            roles: roles
          };
          const token = jwt.sign(tokenEnc);
          console.log(today + ' login user:' + username + ' success.');

          var ip = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress) + '';
          if (ip.search(':') !== -1 && ip.search('.') !== -1) {
            let addr = ip.split(':');
            ip = addr[3];
          }
          var ua = req.header('user-agent');
          loginModel.saveToken(db, {
            created_at: today,
            user_id: results[0].id,
            employee_code: results[0].employee_code,
            employee_id: results[0].employee_no,
            code: token,
            client_agent: ua,
            client_ip: ip,
            expire: expireDate,
            token: tokenKey
          })
            .then((resultToken: any) => {
              userInfo.tokenId = resultToken[0];
              console.log('token id: ' + userInfo.tokenId);
            })
            .catch(error => {
              console.log(error);
            });

          if (moduleName && moduleName !== '') {
            let moduleTrustee = crypto
              .createHash('md5')
              .update(moduleName)
              .digest('hex');
            loginModel.getTrustee(db, results[0].id, moduleTrustee)
              .then((trusteeResult: any) => {
                if (trusteeResult && trusteeResult.length > 0) {
                  const row = trusteeResult[0];
                  const trustee = {
                    module: moduleName,
                    level: row.level,
                    trust: row.trust,
                    office: row.office,
                    default_depart: row.default_depart,
                    default_unit: row.default_unit,
                    default_value: row.default_value,
                    trusted: row.trusted,
                    crud: row.crud,
                    remark: row.remark
                  };
                  res.send({ status: 200, ok: true, data: userInfo, trustee: trustee, roles: roles, token: token })
                } else {
                  res.send({ status: 200, ok: true, data: userInfo, roles: roles, token: token })
                }
              });
          } else {
            res.send({ status: 200, ok: true, data: userInfo, roles: roles, token: token })
          }
        } else {
          console.log(today + ' login user:' + username + ' fail!');
          res.send({ status: 400, ok: false, message: 'ชื่อผู้ใช้งานหรือรหัสผ่าน ไม่ถูกต้อง' })
        }
      })
      .catch(err => {
        console.log(err);
        console.log(today + ' login user:' + username + ' fail!!');
        res.send({ status: 400, ok: false, message: 'Server error!' });
      })
      .finally(() => {
        db.destroy();
      });

  } else {
    res.send({ status: 400, ok: false, message: 'กรุณาระบุชื่อผู้ใช้งานและรหัสผ่าน' })
  }
})

router.post('/get-roles', (req, res, next) => {
  let id = +req.body.id || 0;
  if (id > 0) {
    let db = req.dbHospData;
    loginModel.getModuleRole(db, id)
      .then((results: any) => {
        if (results[0].length > 0) {
          const ro = results[0];
          const roles: any[] = [];
          ro.forEach(e => {
            roles.push(e.modulename);
          });
          setTimeout(() => {
            res.send({ status: 200, ok: true, rows: roles });
          }, 100);
        } else {
          res.send({ status: 400, ok: false, message: results });
        }
      }).catch(error => {
        res.send({ status: 500, ok: false, message: error });
      }).finally(() => {
        db.destroy();
      });
  }
})

router.post('/get-roles-detail', (req, res, next) => {
  let id = +req.body.id || 0;
  let moduleName = req.body.moduleName;
  if (id > 0) {
    let db = req.dbHospData;
    loginModel.getModuleRoleDetail(db, id, moduleName)
      .then((results: any) => {
        if (results[0].length > 0) {
          res.send({ status: 200, ok: true, rows: results[0] });
        } else {
          res.send({ status: 400, ok: false, message: 'not found' });
        }
      }).catch(error => {
        res.send({ status: 500, ok: false, message: error });
      }).finally(() => {
        db.destroy();
      });
  }
})

router.post('/check-token', (req, res, next) => {
  let tokenKey = req.body.tokenKey;

  if (tokenKey) {
    let db = req.dbHospData;
    loginModel
      .getActiveToken(db, tokenKey)
      .then((results: any) => {
        if (results.length > 0) {
          console.log('check token ' + tokenKey + ' founded: ' + results.length);
          res.send({ status: 200, ok: true, rows: results[0] })
        } else {
          console.log('check token ' + tokenKey + ' fial!!');
          res.send({ status: 400, ok: false, error: 'token error!' })
        }
      })
      .catch(error => {
        console.log('check token ' + tokenKey + ' ' + JSON.stringify(error));
        res.send({ status: 400, ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });

  } else {
    console.log('check token ' + tokenKey + ' token error!!');
    res.send({ status: 400, ok: false, error: 'token error!' })
  }
})

router.post('/get-trustee-by-token', async (req, res, next) => {
  let tokenKey = req.body.tokenKey;
  let moduleName = req.body.moduleName;

  if (tokenKey && moduleName) {
    let db = req.dbHospData;

    try {
      const result = await loginModel.getTrusteeByToken(db, tokenKey, moduleName)
      if (result.length > 0) {
        console.log('get trustee ' + tokenKey + ' founded ');
        res.send({ statusCode: 200, status: 200, ok: true, rows: result[0][0] })
      } else {
        console.log('get trustee ' + tokenKey + ' fial!!');
        res.send({ statusCode: 400, status: 400, ok: false, error: 'token or module name error!' })
      }
    } catch (error) {
      console.log('get trustee ' + tokenKey + ' ' + JSON.stringify(error));
      res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
    }

  } else {
    console.log('get trustee ' + tokenKey + ' token or module name invalid!!');
    res.send({ statusCode: 400, status: 400, ok: false, error: 'token or module name invalid!' })
  }
})

export default router;