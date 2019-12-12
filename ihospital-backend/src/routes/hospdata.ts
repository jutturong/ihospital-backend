'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';

import { HospdataModel } from '../models/hospdata';
import { LoginModel } from '../models/login';
import { HospdataService } from '../services/hospdata.service';
import { Jwt } from '../models/jwt';

const router = express.Router();
const hospdataModel = new HospdataModel();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');
const jwt = new Jwt();

router.get('/', (req, res, next) => {
    res.send({
        status: 200,
        ok: true,
        module: 'hospdata',
    });
});

router.post('/opdvisit', async (req, res, next) => {
    let db = req.dbHospData;
    let date: string = req.body.date;
    let dep: any = req.body.dep;

    let chkAuth: any = await checkAuthen(req);
    if (!chkAuth) {
        res.send({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        });
    }

    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, status: 400, ok: false, rows: [] });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    loginModel.saveTokenEvent(db, {
        date: today,
        token: tokenKey,
        type: 'get visit',
        ref: '',
        event: 'date:' + date + ' dep:' + dep
    });

    hospdataModel.getOpdVisit(db, date, dep)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_visit date: ' + date + ' = ' + results.length + ' record<s> founded.');
            res.send({ statusCode: 200, status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/search-opdvisit', async (req, res, next) => {
    let db = req.dbHospData;
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;

    let chkAuth: any = await checkAuthen(req);
    if (!chkAuth) {
        res.send({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        });
    }

    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, status: 400, ok: false, rows: [] });
    }
    hospdataModel.searchOpdVisit(db, typeSearch, textSearch)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_visit ' + typeSearch + ": " + textSearch + ' = ' + results.length + ' record<s> founded.');
            res.send({ statusCode: 200, status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opddx', (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, status: 400, ok: false, rows: [] });
    }
    hospdataModel.getOpdDx(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_dx vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            if (results.length > 0) {
                res.send({ statusCode: 200, status: 200, ok: true, rows: results });
            } else {
                res.send({ statusCode: 200, status: 200, ok: true, rows: [] });
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opdcharge', (req, res, next) => {
    let db = req.dbHospData;
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, status: 400, ok: false, rows: [] });
    }
    hospdataModel.getOpdCharge(db, typeSearch, textSearch)
        .then((results: any) => {
            console.log("\n" + today + ` get: opd_dx ${typeSearch}: ` + textSearch + ' record<s> founded.');
            if (results.length > 0) {
                res.send({ statusCode: 200, status: 200, ok: true, rows: results });
            } else {
                res.send({ statusCode: 200, status: 200, ok: true, rows: [] });
            }
        })
        .catch(error => {
            console.log("\n" + today + ` get: opd_dx ${typeSearch}: ` + textSearch + ' fail!.', error);
            res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opdop', (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getOpdOp(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_op vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opdrx', (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getOpdRx(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_rx vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/getlib/:typeLib', (req, res, next) => {
    let db = req.dbHospData;
    let typeLib: string = req.params.typeLib;
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;
    let orderCode: string = req.body.orderCode;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getLib(db, typeLib, typeSearch, textSearch, orderCode)
        .then((results: any) => {
            console.log("\n" + today + ` get lib ${typeLib} ${typeSearch} ` + textSearch + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log("\n" + today + ` get lib ${typeLib} ${typeSearch} ` + textSearch + ' fail!', error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opddrugs', (req, res, next) => {
    let db = req.dbHospData;
    let hn: string = req.body.hn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getOpdDrugs(db, hn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_drug hn: ' + hn + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opddrug', (req, res, next) => {
    let db = req.dbHospData;
    let codePay: string = req.body.codePay;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getOpdDrug(db, codePay)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_drug code_pay: ' + codePay + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opddrugbyvn', (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getOpdDrugbyvn(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_drug vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opd-image', async (req, res, next) => {
    let db = req.dbHospData;
    let hn: string = req.body.hn;
    let vn: string = req.body.vn;

    let chkAuth: any = await checkAuthen(req);
    if (!chkAuth) {
        res.send({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        });
    }

    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        });
    }
    if (hn || vn) {
        try {
            const result: any = await hospdataModel.getOpdImage(db, hn, vn);
            res.send({ statusCode: HttpStatus.OK, rows: result });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

router.post('/save-opd-image', async (req, res, next) => {
    let db = req.dbHospData;
    let image_id = req.body.image_id || 0;
    let data = req.body.data;

    let chkAuth: any = await checkAuthen(req);
    if (!chkAuth) {
        res.send({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        });
    }

    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        });
    }
    if (data) {
        try {
            const result: any = await hospdataModel.saveOpdImage(db, image_id, data);
            res.send({ statusCode: HttpStatus.OK, result });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

router.post('/labresults', (req, res, next) => {
    let db = req.dbHospData;
    let hn: string = req.body.hn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getLabResults(db, hn)
        .then((results: any) => {
            console.log("\n" + today + ' get: lab result hn: ' + hn + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/pathology/:columnName/:value', (req, res, next) => {
    let columnName = req.params.columnName;
    let value = req.params.value;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return;
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    let db = req.dbHospData;
    hospdataModel.getPatho(db, columnName, value)
        .then((results: any) => {
            console.log(`get pathology ${columnName} = ${value} ` + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});


router.post('/labrequest', (req, res, next) => {
    let db = req.dbHospData;
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getLabRequest(db, typeSearch, textSearch)
        .then((results: any) => {
            console.log("\n" + today + ` get: lab request ${typeSearch}: ` + textSearch + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/labresult', (req, res, next) => {
    let db = req.dbHospData;
    let labNo: string = req.body.labNo;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.getLabResult(db, labNo)
        .then((results: any) => {
            console.log("\n" + today + ' get: lab result labno: ' + labNo + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-cscd-approve', async (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let arrData = req.body.arrData;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '' || !arrData) {
        res.send({ ok: false, rows: [] });
    }

    try {
        const result: any = await hospdataModel.saveCSCDApprove(db, vn, arrData);
        res.send({ status: 200, ok: true, statusCode: HttpStatus.OK, result });
    } catch (error) {
        res.send({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            ok: false,
            message: error.message
        });
    }
    // hospdataModel.saveCSCDApprove(db, vn, arrData)
    //     .then((results: any) => {
    //         console.log('save cscd approve: ' + vn + ' success.');
    //         res.send({ status: 200, ok: true, result: results });
    //     })
    //     .catch(error => {
    //         console.log('save cscd approve: ' + vn + ' fail!!', error);
    //         res.send({ status: 500, ok: false, error: error, message: error.message })
    //     })
    //     .finally(() => {
    //         db.destroy();
    //     });
});

router.post('/save-opd-diag', (req, res, next) => {
    let db = req.dbHospData;
    let ref: string = req.body.ref;
    let newData = req.body.newData;
    let oldData = req.body.oldData;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveOpdDiag(db, ref, newData, oldData)
        .then((results: any) => {
            console.log("\n" + today + ' save dx opd vn: ' + newData.vn + ' diag: ' + newData.diag + ' success.');
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save dx opd vn: ' + newData.vn + ' diag: ' + newData.diag + ' fail!!! ' + error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-cscd-edc', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let data = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    const today = moment().format('HH:mm:ss');
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.saveData(db, 'claim_edc', 'approve_code', ref, data)
        .then((results: any) => {
            console.log("\n" + today + ' save claim_edc ' + ref + ' success.');
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save claim_edc ' + ref + ' fail!!! ' + error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-lib-rx-opd', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let data = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    hospdataModel.saveData(db, 'lib_rx_code_opd', 'code', ref, data)
        .then((results: any) => {
            console.log("\n" + today + ' save rx opd ' + ref + ' success.');
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save rx opd ' + ref + ' fail!!! ' + error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-lib-rx-ipd', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let data = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }

    hospdataModel.saveData(db, 'lib_rx_code_ipd', 'code', ref, data)
        .then((results: any) => {
            console.log("\n" + today + ' save rx ipd ' + ref + ' success.');
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save rx ipd ' + ref + ' fail!!! ' + error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-lib-icd-cm', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let data = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }

    hospdataModel.saveData(db, 'lib_icd9_cm', 'code', ref, data)
        .then((results: any) => {
            console.log("\n" + today + ' save lib_icd9_cm ' + ref + ' success.');
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save lib_icd9_cm ' + ref + ' fail!!! ' + error);
            res.send({ status: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-autoincrement', (req, res, next) => {
    let db = req.dbHospData;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveAutoincrement(db, formInput)
        .then((results: any) => {
            console.log("\n" + today + ' save autoincrement ' + JSON.stringify(formInput) + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save dx opd autoincrement ' + JSON.stringify(formInput) + + ' fail!!! ' + error);
            res.send({ ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-opd-drug', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveDrugOpd(db, ref, formInput)
        .then((results: any) => {
            console.log(today + ' save pharmacy_opd_drug_pay ' + ref + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save pharmacy_opd_drug_pay ' + ref + + ' fail!!! ' + error);
            res.send({ ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-opd-drug-item', async (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveDrugItemOpd(db, ref, formInput)
        .then((results: any) => {
            console.log(today + ' save pharmacy_opd_item_pay ' + ref + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save pharmacy_opd_item_pay ' + ref + + ' fail!!! ' + error);
            res.send({ ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-fu', (req, res, next) => {
    let db = req.dbHospData;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveFu(db, formInput)
        .then((results: any) => {
            console.log(today + ' save fu: ' + formInput.ref + ' vn: ' + formInput.vn + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + ' save fu: ' + formInput.ref + ' vn: ' + formInput.vn + ' fail!!! ' + error);
            res.send({ ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/remove-opd-diag', (req, res, next) => {
    let db = req.dbHospData;
    let arrData = req.body.arrData;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.removeOpdDiag(db, arrData)
        .then((results: any) => {
            console.log("\n" + today + ' delete dx opd vn: ' + arrData.vn + ' diag: ' + arrData.diag + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save dx opd vn: ' + arrData.vn + ' diag: ' + arrData.diag + ' fail!!! ' + error);
            res.send({ ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-opd-visit', async (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let data = req.body.data;

    if (vn && data) {
        try {
            const result = await hospdataModel.saveOpdVisit(db, vn, data);
            console.log(today + ' save opd visit vn: ' + vn + '  success.');
            res.send({
                statusCode: HttpStatus.OK,
                ok: true,
                result
            });
        } catch (error) {
            console.log(today + ' save opd visit vn: ' + vn + ' fail!!! ' + error);
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                ok: false,
                error: error,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

router.post('/opd-vs', async (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, status: 400, ok: false, rows: [] });
    }

    if (vn) {
        try {
            const result = await hospdataModel.getOpdVS(db, vn);
            console.log("\n" + today + ' get: opd_visit vn: ' + vn + ' = ' + result.length + ' record<s> founded.');
            res.send({
                statusCode: HttpStatus.OK,
                status: HttpStatus.OK,
                ok: true,
                rows: result[0],
                row: result[0]
            });
        } catch (error) {
            console.log(error);
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                ok: false,
                error: error,
                message: error.message
            })
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

router.post('/save-opd-vs', async (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let data = req.body.data;

    if (vn && data) {
        try {
            const result = await hospdataModel.saveOpdVs(db, vn, data);
            console.log(today + ' save opd vs vn: ' + vn + '  success.');
            res.send({
                statusCode: HttpStatus.OK,
                ok: true, result
            });
        } catch (error) {
            console.log(today + " save opd vs vn: " + vn + ' fail!!! ' + error.message);
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                ok: false, error: error, message: error.message
            })

        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

router.post('/save-opd-op', (req, res, next) => {
    let db = req.dbHospData;
    let ref: string = req.body.ref;
    let newData = req.body.newData;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveOpdOp(db, ref, newData)
        .then((results: any) => {
            console.log(today + " save op opd vn: " + newData.vn + ' diag: ' + newData.diag + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save op opd vn: " + newData.vn + ' diag: ' + newData.diag + ' fail!!! ' + error);
            res.send({ ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/remove-opd-op', (req, res, next) => {
    let db = req.dbHospData;
    let arrData = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, ok: false, rows: [] });
    }
    hospdataModel.removeOpdOp(db, arrData)
        .then((results: any) => {
            console.log(today + " delete op opd vn: " + arrData.vn + ' diag: ' + arrData.diag + ' success.');
            res.send({ statusCode: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save op opd vn: " + arrData.vn + ' diag: ' + arrData.diag + ' fail!!! ' + error);
            res.send({ statusCode: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-absent', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, ok: false, rows: [] });
    }
    hospdataModel.saveAbsent(db, ref, formInput)
        .then((results: any) => {
            console.log(today + " save absent id: " + ref + ' success.');
            res.send({ statusCode: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save absent id: " + ref + ' fail!!! ' + error);
            res.send({ statusCode: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-anc-registry', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, ok: false, rows: [] });
    }
    hospdataModel.saveAncRegistry(db, ref, formInput)
        .then((results: any) => {
            console.log(today + " save anc-registry id: " + ref + ' success.');
            res.send({ statusCode: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save anc-registry id: " + ref + ' fail!!! ' + error);
            res.send({ statusCode: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-gestation-registry', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveGestationRegistry(db, ref, formInput)
        .then((results: any) => {
            console.log(today + " save gestation_registry id: " + ref + ' success.');
            res.send({ statusCode: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save gestation_registry id: " + ref + ' fail!!! ' + error);
            res.send({ statusCode: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-gestation-detail', (req, res, next) => {
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    } else {
        let db = req.dbHospData;
        let ref = req.body.ref;
        let tableName = req.body.tableName;
        let columnId = req.body.columnId;
        let moduleName = req.body.moduleName;
        let formInput = req.body.formInput;
        hospdataModel.saveGestationDetail(db, tableName, columnId, ref, formInput)
            .then((results: any) => {
                console.log(today + " save gestation detail id: " + ref + ' success.');
                res.send({ statusCode: 200, ok: true, result: results });
            })
            .catch(error => {
                console.log(today + " save gestation detail id: " + ref + ' fail!!! ' + error);
                res.send({ statusCode: 500, ok: false, error: error, message: error.message })
            })
            .finally(() => {
                db.destroy();
            });
    }
});


router.post('/save-sepsis-registry', (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref;
    let formInput = req.body.formInput;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveSepsisRegistry(db, ref, formInput)
        .then((results: any) => {
            console.log(today + " save sepsis-registry id: " + ref + ' success.');
            res.send({ statusCode: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save sepsis-registry id: " + ref + ' fail!!! ' + error);
            res.send({ statusCode: 500, ok: false, error: error, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-address', (req, res, next) => {
    let db = req.dbHospData;
    let columnName = req.body.columnName;
    let textSearch = req.body.textSearch;
    let typeSearch = req.body.typeSearch || '=';
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, ok: false, rows: [] });
    }
    hospdataModel.getAddress(db, columnName, textSearch, typeSearch)
        .then((results: any) => {
            console.log(today + ` get address ${columnName} ${typeSearch} ${textSearch} success.`);
            res.status(200).send({ statusCode: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log(today + ` get address ${columnName} ${typeSearch} ${textSearch} fail!!.` + error);
            res.send({ statusCode: 500, ok: false, error: error, message: error.message });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/selectData', async (req, res, next) => {
    let tableName = req.body.tableName;
    let selectText = req.body.selectText;
    let whereText = req.body.whereText;
    let groupBy = req.body.groupBy;
    let having = req.body.having;
    let orderText = req.body.orderText;
    let limit = req.body.limit;
    let db = req.dbHospData;

    if (!checkAuthen(req)) {
        console.log('error: authen', req.url);
        res.send({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        });
    }

    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.status(400).send({ statusCode: 400, ok: false, rows: [] });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const saveLog = await loginModel.saveTokenEvent(db, {
            date: today,
            token: tokenKey,
            type: 'select ' + tableName,
            ref: '',
            event: whereText
        });
    } catch (error) {
        console.log("save log ", error.message)
    }

    try {
        const result = await hospdataModel.selectSql(db, tableName, selectText, whereText, groupBy, having, orderText, limit);
        console.log("select " + tableName + ': ' + result.length + ' record<s> founded.');
        res.send({ statusCode: 200, ok: true, rows: result });
    } catch (error) {
        console.log("select " + tableName, error.message);
        res.send({ statusCode: 500, ok: false, error: error, message: error.message });
    }

    // hospdataModel.selectSql(db, tableName, selectText, whereText, groupBy, having, orderText, limit)
    //     .then((result: any) => {
    //         // console.log("select " + tableName + ': ' + result.length + ' record<s> founded.');
    //         res.status(200).send({ statusCode: 200, ok: true, rows: result });
    //     }).catch(error => {
    //         console.log("select " + tableName, error.message);
    //         res.status(500).send({ statusCode: 500, ok: false, error: error, message: error.message });
    //     });

});

function checkAuthen(req) {
    let token: string = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.body && req.body.token) {
        token = req.body.token;
    }

    if (!token) {
        return false;
    } else if (jwt.verify(token)) {
        return true;
    } else {
        return false;
    }
}



export default router;
