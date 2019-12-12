'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { LoginModel } from '../models/login';
import { HospdataService } from '../services/hospdata.service';
import { EmployeeModel } from '../models/employee';

const router = express.Router();
const employeeModel = new EmployeeModel();
const loginModel = new LoginModel();
const today = moment().format('YYYY-MM-DD HH:mm:ss');
let errorRespond = {};

router.get('/', (req, res, next) => {
    res.send({
        ok: true,
        module: 'employee',
        date: today,
        token: 'none'
    });
});

router.post('/get-employee', (req, res, next) => {
    let db = req.dbHospData;
    let employeeId: any = req.body.employeeId;
    let employeeNo: any = req.body.employeeNo;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    employeeModel.getEmployee(db, { id: employeeId, no: employeeNo })
        .then((results: any) => {
            console.log('employee ' + employeeId + ' ' + employeeNo + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-employee-by-uid', (req, res, next) => {
    let db = req.dbHospData;
    let employeeId: any = req.body.employeeId;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    employeeModel.getEmployee(db, { code: employeeId })
        .then((results: any) => {
            let rs = results[0];
            delete rs.encr;
            delete rs.hash;
            delete rs.passwd;
            delete rs.password;
            delete rs.sha;
            console.log('employee ' + employeeId + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: rs });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-employee-by-salaryno', (req, res, next) => {
    let db = req.dbHospData;
    let salaryNo: any = req.body.salaryNo;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    employeeModel.getEmployee(db, { no: salaryNo })
        .then((results: any) => {
            results.forEach((e, index) => {
                delete results[index].encr;
                delete results[index].hash;
                delete results[index].passwd;
                delete results[index].password;
                delete results[index].sha;
            });
            console.log('employee ' + salaryNo + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-employee', (req, res, next) => {
    let db = req.dbHospData;
    let employeeCode: any = req.body.employeeCode;
    let inputData: any = req.body.inputData;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '' || !inputData) {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    employeeModel.saveEmployee(db, employeeCode, inputData)
        .then((results: any) => {
            console.log('save employee ' + employeeCode + ' success.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-salary', (req, res, next) => {
    let db = req.dbHospData;
    let salaryNo = req.body.salaryNo;
    let month = +req.body.month;
    let year = +req.body.year;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getSalary(db, salaryNo, month, year)
        .then((results: any) => {
            console.log('salary ' + salaryNo + ' ' + month + ' ' + year +
                ' = ' + results.length + ' record<s> founded.');
            employeeModel.getSalaryItem(db, salaryNo, month, year)
                .then((items: any) => {
                    res.send({
                        status: 200,
                        ok: true,
                        rows: { data: results, item: items }
                    });
                });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-tax-yearly', (req, res, next) => {
    let db = req.dbHospData;
    let salaryNo = req.body.salaryNo;
    let year = +req.body.year;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    if (salaryNo === '' || year < 2545) {
        res.send({ status: 400, ok: false, error: 'Invalid parameters' });
    }

    employeeModel.getTaxYearly(db, salaryNo, year)
        .then((results: any) => {
            console.log('tax yearly ' + salaryNo + ' ' + year +
                ' = ' + results.length + ' record<s> founded.');
            res.send({
                status: 200,
                ok: true,
                rows: results
            });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/selectData', (req, res, next) => {
    let tableName = req.body.tableName;
    let selectText = req.body.selectText;
    let whereText = req.body.whereText;
    let groupBy = req.body.groupBy;
    let having = req.body.having;
    let orderText = req.body.orderText;
    let limit = req.body.limit;
    let db = req.dbHospData;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    loginModel.saveTokenEvent(db, {
        date: today,
        token: tokenKey,
        type: 'select ' + tableName,
        ref: '',
        event: whereText
    })
        .then((r: any) => {
        })
        .catch(error => {
            console.log(error);
        });

    employeeModel.selectSql(db, tableName, selectText, whereText, groupBy, having, orderText, limit)
        .then((results: any) => {
            console.log(today + " select " + tableName + ' ' + whereText + ' = ' + results[0].length + ' record<s> founded.');
            res.send({ ok: true, rows: results[0] });
        })
        .finally(() => {
            db.destroy();
        })
        .catch(error => {
            console.log({ error: error })
            res.send({ ok: false, error: error })
        });
});

// table: radius - Internet account ================================
router.post('/save-radius', (req, res, next) => {
    let db = req.dbHospData;
    let uid: any = req.body.uid;
    let data: any = req.body.data;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.saveRadcheck(db, uid, data)
        .then((results: any) => {
            console.log('save radius ' + uid + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('save radius error', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-radius', (req, res, next) => {
    let db = req.dbHospData;
    let userName: any = req.body.userName;
    let attribute: any = req.body.attribute || 'MD5-Password';
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getRadcheck(db, userName, attribute)
        .then((results: any) => {
            console.log('get radius ' + userName + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('get radius error', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-radusergroup', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let data: any = req.body.data;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.saveRadusergroup(db, id, data)
        .then((results: any) => {
            console.log('save radusergroup ' + id + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('save radusergroup error', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-radusergroup', (req, res, next) => {
    let db = req.dbHospData;
    let userName: any = req.body.userName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getRadusergroup(db, userName)
        .then((results: any) => {
            console.log('get radusergroup ' + userName + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('get radusergroup error', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

// table: employee-calendar ================================
router.post('/save-calendar', (req, res, next) => {
    let db = req.dbHospData;
    let ref: any = req.body.ref;
    let formInput: any = req.body.formInput;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.saveCalendar(db, ref, formInput)
        .then((results: any) => {
            console.log('save calendar ' + ref + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('save calendar error', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/delete-calendar', (req, res, next) => {
    let db = req.dbHospData;
    let ref: any = req.body.ref;
    let employeeId = req.body.employeeId;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.status(400).send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.deleteCalendar(db, ref)
        .then((results: any) => {
            console.log('delete calendar ' + results);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('delete calendar error ', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-calendar', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref || 0;
    let employeeId = req.body.employeeId || '';
    let departmentId = req.body.departmentId || '';
    let dateStart = req.body.dateStart;
    let dateEnd = req.body.dateEnd;
    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getCalendar(db, ref, employeeId, departmentId, dateStart, dateEnd)
        .then((results: any) => {
            console.log('get calendar ' + employeeId + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('get calendar error', error);
            res.status(400).send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

// table: employee-account ================================
router.post('/save-employee-account', (req, res, next) => {
    let db = req.dbHospData;
    let ref: any = req.body.ref;
    let formInput: any = req.body.formInput;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.savePayment(db, ref, formInput)
        .then((results: any) => {
            console.log('save employee-account ' + ref + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('save employee-account error', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/delete-employee-account', (req, res, next) => {
    let db = req.dbHospData;
    let ref: any = req.body.ref;
    let employeeId = req.body.employeeId;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.status(400).send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.deletePayment(db, ref, employeeId)
        .then((results: any) => {
            console.log('delete employee-account ' + results);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('delete employee-account error ', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-employee-account', (req, res, next) => {
    let db = req.dbHospData;
    let employeeId = req.body.employeeId;
    let dateStart = req.body.dateStart;
    let dateEnd = req.body.dateEnd;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getPayment(db, employeeId, dateStart, dateEnd)
        .then((results: any) => {
            console.log('get employee-account ' + employeeId + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('get employee-account error', error);
            res.status(400).send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

// table: employee-vehicle ================================
router.post('/save-vehicle', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let formInput: any = req.body.formInput;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.saveVehicle(db, id, formInput)
        .then((results: any) => {
            console.log('save Vehicle ' + id + ' = ' + results.length);
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/delete-vehicle', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let employeeId = req.body.employeeId;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.status(400).send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.deleteVehicle(db, id, employeeId)
        .then((results: any) => {
            console.log('delete Vehicle ' + results);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-vehicle', (req, res, next) => {
    let db = req.dbHospData;
    let employeeId = req.body.employeeId;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getVehicle(db, employeeId)
        .then((results: any) => {
            console.log('get Vehicle ' + employeeId + ' = ' + results.length);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

// table: employee-carpark ================================
router.post('/save-employee-carpark', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let formInput: any = req.body.formInput;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.saveEmployeeCarPark(db, id, formInput)
        .then((results: any) => {
            console.log('save employee-carpark ' + id + ' = ' + results.length);
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('save employee-carpark ', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/delete-employee-carpark', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let employeeId = req.body.employeeId;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.status(400).send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.deleteEmployeeCarPark(db, id, employeeId)
        .then((results: any) => {
            console.log('delete employee-carpark ' + results);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-employee-carpark', (req, res, next) => {
    let db = req.dbHospData;
    let employeeId: any = req.body.employeeId || '';
    let period: any = req.body.period || 2;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getEmployeeCarPark(db, employeeId, period)
        .then((results: any) => {
            console.log('get car park ' + employeeId + ' = ' + results.length + ' record<s> founded.');
            res.status(200).status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-carpark', (req, res, next) => {
    let db = req.dbHospData;
    let year: any = req.body.year || 2561;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getCarPark(db, year)
        .then((results: any) => {
            console.log('car park ' + year + ' = ' + results.length + ' record<s> founded.');
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/search-carpark-by-column', (req, res, next) => {
    let db = req.dbHospData;
    let year: any = req.body.year || 2561;
    let typeSearch: string = req.body.typeSearch || 'fname';
    let textSearch: string = req.body.textSearch || '';

    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    if (textSearch === '') {
        res.send({ status: 400, ok: false, error: 'Invalid parameter' });
    }

    employeeModel.searchCarPark(db, year, typeSearch, textSearch)
        .then((results: any) => {
            console.log('search car park ' + year + ' ' + typeSearch + '=' + textSearch + ' , founded' + results.length + ' record<s>.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-carpark', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let formInput: any = req.body.formInput;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.saveCarPark(db, id, formInput)
        .then((results: any) => {
            console.log('save car park ' + id + ' = ' + results.length);
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-carpark-comment', (req, res, next) => {
    let db = req.dbHospData;
    let year: any = req.body.year || 2561;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.getCarParkComment(db, year)
        .then((results: any) => {
            console.log('car park comment ' + year + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-carpark-comment', (req, res, next) => {
    let db = req.dbHospData;
    let ref: any = req.body.ref;
    let formInput: any = req.body.formInput;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    employeeModel.saveCarParkComment(db, ref, formInput)
        .then((results: any) => {
            console.log('save car park comment ' + ref + ' = ' + results.length);
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

function validateToken(req, res, next) {
    const tokenKey = req.body.tokenKey || '';
    if (tokenKey.length >= 16) {
        let db = req.dbClaim;
        loginModel.checkToken(db, tokenKey, 'token')
            .then((r: any) => {
                if (r) {
                    const row = r[0];
                    // console.log('validateToken', moment(row.expire).locale('th').format('YYYY-MM-DD HH:mm:ss'));
                    if (moment(row.expire).locale('th').format('YYYY-MM-DD HH:mm:ss') >
                        moment().locale('th').format('YYYY-MM-DD HH:mm:ss')
                        && row.isactive > 0) {
                        return next();
                    } else {
                        errorRespond = { status: 401, message: 'token invalid or expired.' }
                        res.redirect('/claim/invalidToken');
                    }
                } else {
                    errorRespond = { status: 406, message: 'token invalid or not founded.' }
                    res.redirect('/claim/invalidToken');
                }
            }).catch(err => {
                errorRespond = { status: 500, message: 'server error!' }
                res.redirect('/claim/invalidToken');
                /*})
                .finally(() => {
                  db.destroy();*/
            });
    } else {
        errorRespond = { status: 411, message: 'Not found parameter.' }
        res.redirect('/claim/invalidToken');
    }
}

router.get('/invalidToken', (req, res, next) => {
    const error = errorRespond;
    errorRespond = {};
    res.send({
        ok: false,
        date: moment().locale('th').format('YYYY-MM-DD HH:mm:ss'),
        error: error
    });
    return;
});

export default router;