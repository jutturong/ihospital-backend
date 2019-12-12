'use strict';

import * as express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send({
        status: 200,
        ok: true,
        module: 'openerp',
    });
});

export default router;