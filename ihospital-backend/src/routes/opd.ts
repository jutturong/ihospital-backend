'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { HospdataModel } from '../models/hospdata';
import { LoginModel } from '../models/login';
import { HospdataService } from '../services/hospdata.service';
import { OpdModel } from '../models/opd';

const router = express.Router();
const hospdataModel = new HospdataModel();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const opdModel = new OpdModel();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

router.get('/', (req, res, next) => {
    res.send({
        status: 200,
        ok: true,
        module: 'opd',
    });
});

router.post('/opdvisit', (req, res, next) => {
    let db = req.dbHospData;
    let date: string = req.body.date;
    let dep: any = req.body.dep;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
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
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/search-opdvisit', (req, res, next) => {
    let db = req.dbHospData;
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.searchOpdVisit(db, typeSearch, textSearch)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_visit ' + typeSearch + ": " + textSearch + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/opdvs', (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getOpdVS(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_visit vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results[0] });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getOpdDx(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_dx vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            if (results.length > 0) {
                res.send({ ok: true, rows: results });
            } else {
                res.send({ ok: true, rows: [] });
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getOpdOp(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_op vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getOpdRx(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_rx vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getOpdDrugs(db, hn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_drug hn: ' + hn + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getOpdDrug(db, codePay)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_drug code_pay: ' + codePay + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getOpdDrugbyvn(db, vn)
        .then((results: any) => {
            console.log("\n" + today + ' get: opd_drug vn: ' + vn + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/labresults', (req, res, next) => {
    let db = req.dbHospData;
    let hn: string = req.body.hn;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getLabResults(db, hn)
        .then((results: any) => {
            console.log("\n" + today + ' get: lab result hn: ' + hn + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.getLabResult(db, labNo)
        .then((results: any) => {
            console.log("\n" + today + ' get: lab result labno: ' + labNo + ' = ' + results.length + ' record<s> founded.');
            res.send({ ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
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
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log("\n" + today + ' save dx opd vn: ' + newData.vn + ' diag: ' + newData.diag + ' fail!!! ' + error);
            res.send({ ok: false, error: error })
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
            res.send({ ok: false, error: error })
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
            res.send({ ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-opd-drug-item', (req, res, next) => {
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
            res.send({ ok: false, error: error })
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
            res.send({ ok: false, error: error })
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
            res.send({ ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-opd-visit', (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let data = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveOpdVisit(db, vn, data)
        .then((results: any) => {
            console.log(today + ' save opd visit vn: ' + vn + '  success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + ' save opd visit vn: ' + vn + ' fail!!! ' + error);
            res.send({ ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-opd-vs', async (req, res, next) => {
    let db = req.dbHospData;
    let vn: string = req.body.vn;
    let data = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ ok: false, rows: [] });
    }
    try {
        const result = await hospdataModel.saveOpdVs(db, vn, data);
        console.log(today + ' save opd vs vn: ' + vn + '  success.');
        res.send({ ok: true, result });
    } catch (error) {
        console.log(today + " save opd vs vn: " + vn + ' fail!!! ' + error);
        res.send({ ok: false, error: error })
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
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.removeOpdOp(db, arrData)
        .then((results: any) => {
            console.log(today + " delete op opd vn: " + arrData.vn + ' diag: ' + arrData.diag + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save op opd vn: " + arrData.vn + ' diag: ' + arrData.diag + ' fail!!! ' + error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveAbsent(db, ref, formInput)
        .then((results: any) => {
            console.log(today + " save absent id: " + ref + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save absent id: " + ref + ' fail!!! ' + error);
            res.send({ ok: false, error: error })
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
        res.send({ ok: false, rows: [] });
    }
    hospdataModel.saveAncRegistry(db, ref, formInput)
        .then((results: any) => {
            console.log(today + " save anc-registry id: " + ref + ' success.');
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save anc-registry id: " + ref + ' fail!!! ' + error);
            res.send({ ok: false, error: error })
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
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save gestation_registry id: " + ref + ' fail!!! ' + error);
            res.send({ ok: false, error: error })
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
                res.send({ ok: true, result: results });
            })
            .catch(error => {
                console.log(today + " save gestation detail id: " + ref + ' fail!!! ' + error);
                res.send({ ok: false, error: error })
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
            res.send({ ok: true, result: results });
        })
        .catch(error => {
            console.log(today + " save sepsis-registry id: " + ref + ' fail!!! ' + error);
            res.send({ ok: false, error: error });
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
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ statusCode: 400, ok: false, rows: [] });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');

    // try {
    //     const saveLog = await loginModel.saveTokenEvent(db, {
    //         date: today,
    //         token: tokenKey,
    //         type: 'select ' + tableName,
    //         ref: '',
    //         event: whereText
    //     });
    // } catch (error) {
    //     console.log("save log ", error.message)
    // }

    // try {
    //     const result = await hospdataModel.selectSql(db, tableName, selectText, whereText, groupBy, having, orderText, limit);
    //     console.log("select " + tableName + ': ' + result.length + ' record<s> founded.');
    //     res.send({ statusCode: 200, ok: true, rows: result });
    // } catch (error) {
    //     console.log("select " + tableName, error.message);
    //     res.send({ statusCode: 500, ok: false, error: error, message: error.message });
    // }

    await hospdataModel.selectSql(db, tableName, selectText, whereText, groupBy, having, orderText, limit)
        .then((result: any) => {
            // console.log("select " + tableName + ': ' + result.length + ' record<s> founded.');
            res.send({ statusCode: 200, ok: true, rows: result });
        }).catch(error => {
            console.log("select " + tableName, error.message);
            res.send({ statusCode: 500, ok: false, error: error, message: error.message });
        });

});


export default router;