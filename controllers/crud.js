const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const _this = this;

exports.create = (req, res) => {
    const {
        brewer,
        beer,
        gyle,
        fv
    } = req.body;
    const {
        mashIn,
        copperUp,
        mashTemp,
        gravity_after_boil,
        setTaps,
        dip_after_boil,
        first_runnings,
        dip_in_liquor,
        last_runnings,
        wort_pH,
        collection_dip
    } = req.body;
    const {
        issue_no,
        mashing_liquor,
        action_mashing_liquor,
        glass_audit,
        action_glass_audit,
        racking_tank,
        action_racking_tank,
        fermenter,
        action_fermenter,
        auger_grain_chute,
        action_auger_grain_chute,
        trailer,
        action_trailer,
        premasher,
        action_premasher,
        mash_tun_plates,
        action_mash_tun_plates,
        copper,
        action_copper,
        pipes_paraflow,
        action_pipes_paraflow
    } = req.body;
    const {
        temp,
        hours,
        taste,
        gravity,
        action
    } = req.body;



    console.log(req.body);

    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    // Check if gyle already exists
    db.query(`SELECT gyle FROM brew WHERE gyle = '${gyle}'`, (err, results) => {
        if (err) {
            throw err;
        }

        // Message variables
        let message = '';

        // If gyle exists, return error
        if (results.length > 0) {
            message += 'Gyle already exists. ';
            _this.read(req, res);
        } else {

            let queries = [`INSERT INTO brew (brewer, beer, gyle, date, fv, mashIn, copperUp, mashTemp, gravity_after_boil, setTaps, dip_after_boil, first_runnings, dip_in_liquor, last_runnings, wort_pH, collection_dip, issue_no, action_mashing_liquor, action_glass_audit, action_racking_tank, action_fermenter, action_auger_grain_chute, action_trailer, action_premasher, action_mash_tun_plates, action_copper, action_pipes_paraflow, mashing_liquor, glass_audit, racking_tank, fermenter, auger_grain_chute, trailer, premasher, mash_tun_plates, copper, pipes_paraflow ) VALUES ( '${brewer}', '${beer}', '${gyle}', '${date}', '${fv}', '${mashIn}', '${copperUp}', '${mashTemp}', '${gravity_after_boil}', '${setTaps}', '${dip_after_boil}', '${first_runnings}', '${dip_in_liquor}', '${last_runnings}', '${wort_pH}', '${collection_dip}', '${issue_no}', '${action_mashing_liquor}', '${action_glass_audit}', '${action_racking_tank}', '${action_fermenter}', '${action_auger_grain_chute}', '${action_trailer}', '${action_premasher}', '${action_mash_tun_plates}', '${action_copper}', '${action_pipes_paraflow}', '${mashing_liquor}', '${glass_audit}', '${racking_tank}', '${fermenter}', '${auger_grain_chute}', '${trailer}', '${premasher}', '${mash_tun_plates}', '${copper}', '${pipes_paraflow}')`,
                `INSERT INTO fermentation_records (gyle, date, hours, temp, gravity, taste, action ) VALUES ( '${gyle}', '${date}', '${hours}', '${temp}', '${gravity}', '${taste}', '${action}')`
            ];
            let count = 0;
            try {
                queries.forEach(query => {
                    if (count === 0) {
                        count = count + 1;
                        // Insert into brew table            
                        db.query(query, (err, results) => {
                            if (err) {
                                throw err;
                            }
                        });
                    } else {
                        if (hours.length !== 0) {
                            // Insert into brew table            
                            db.query(query, (err, results) => {
                                if (err) {
                                    throw err;
                                }
                            });
                        }
                    }
                });
            } catch (error) {

            } finally {
                message += 'Brew added successfully';
                _this.read(req, res);
            }
        }
    });
}

exports.read = (req, res) => {
    let {
        search
    } = req.body;

    // Check if search is empty
    if (search === undefined) {
        search = '';
    }

    db.query(`SELECT * FROM brew WHERE id LIKE '%${search}%' OR date LIKE '%${search}%' OR brewer LIKE '%${search}%' OR gyle LIKE '%${search}%' OR beer LIKE '%${search}%' OR fv LIKE '%${search}%' order by date desc LIMIT 10`, (err, data) => {
        if (err) {
            throw err;
        }

        if (data.length > 0) {
            data.forEach((item) => {
                item.date = item.date.toUTCString();
            });
            res.render('../views/tableData', {
                message: `${data.length} entries retrieved successfully`,
                data,
                color: 'success'
            });
        } else {
            res.render('../views/tableData', {
                message: 'Data not found',
                color: 'danger'
            });
        }
    });
}

exports.edit = (req, res) => {

    const gyle = req.params.gyle;

    db.query(`SELECT * FROM brew WHERE gyle=${gyle}`, (err, data) => {
        if (err) {
            throw err;
        }
        if (data.length > 0) {
            db.query(`SELECT * FROM fermentation_records WHERE gyle=${gyle}`, (err, fdata) => {
                res.render('../views/edit', {
                    message: `Edit Gyle ${gyle}`,
                    data,
                    fdata,
                    color: 'warning'
                });
            });
        } else {
            res.render('../views/tableData', {
                message: 'Data not found',
                color: 'danger'
            });
        }
    });
}

exports.update = (req, res) => {
    const gyle = req.params.gyle;

    const {
        brewer,
        beer,
        fv
    } = req.body;
    const {
        mashIn,
        copperUp,
        mashTemp,
        gravity_after_boil,
        setTaps,
        dip_after_boil,
        first_runnings,
        dip_in_liquor,
        last_runnings,
        wort_pH,
        collection_dip
    } = req.body;
    const {
        issue_no,
        mashing_liquor,
        action_mashing_liquor,
        glass_audit,
        action_glass_audit,
        racking_tank,
        action_racking_tank,
        fermenter,
        action_fermenter,
        auger_grain_chute,
        action_auger_grain_chute,
        trailer,
        action_trailer,
        premasher,
        action_premasher,
        mash_tun_plates,
        action_mash_tun_plates,
        copper,
        action_copper,
        pipes_paraflow,
        action_pipes_paraflow
    } = req.body;
    const {
        hours,
        temp,
        gravity,
        taste,
        action
    } = req.body;

    console.log(req.body);

    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    // Insert into brew table
    db.query(`UPDATE brew SET brewer='${brewer}', beer='${beer}', gyle='${gyle}', date='${date}', fv='${fv}', mashIn='${mashIn}', copperUp='${copperUp}', mashTemp='${mashTemp}', gravity_after_boil='${gravity_after_boil}', setTaps='${setTaps}', dip_after_boil='${dip_after_boil}', first_runnings='${first_runnings}', dip_in_liquor='${dip_in_liquor}', last_runnings='${last_runnings}', wort_pH='${wort_pH}', collection_dip='${collection_dip}', issue_no='${issue_no}', mashing_liquor='${mashing_liquor}', action_mashing_liquor='${action_mashing_liquor}', glass_audit='${glass_audit}', action_glass_audit='${action_glass_audit}', racking_tank='${racking_tank}', action_racking_tank='${action_racking_tank}', fermenter='${fermenter}', action_fermenter='${action_fermenter}', auger_grain_chute='${auger_grain_chute}', action_auger_grain_chute='${action_auger_grain_chute}', trailer='${trailer}', action_trailer='${action_trailer}', premasher='${premasher}', action_premasher='${action_premasher}', mash_tun_plates='${mash_tun_plates}', action_mash_tun_plates='${action_mash_tun_plates}', copper='${copper}', action_copper='${action_copper}', pipes_paraflow='${pipes_paraflow}', action_pipes_paraflow='${action_pipes_paraflow}' WHERE gyle=${gyle}`, (err, results) => {
        if (err) {
            throw err;
        }
        if (hours.length !== 0) {
            console.log(hours);
            db.query(`INSERT INTO fermentation_records(gyle, date, hours, temp, gravity, taste, action) VALUES('${gyle}', '${date}', '${hours}', '${temp}', '${gravity}', '${taste}', '${action}')`, (err, results) => {
                if (err) {
                    throw err;
                }
                _this.read(req, res);
            });
        } else {
            _this.read(req, res);
        }
    });

}

exports.delete = (req, res) => {
    const gyle = req.params.gyle;

    db.query(`DELETE FROM brew WHERE gyle = ${gyle}`, (err, results) => {
        if (err) {
            throw err;
        }
        db.query(`DELETE FROM fermentation_records WHERE gyle = ${gyle}`, (err, results) => {
            if (err) {
                throw err;
            }
            _this.read(req, res);
        });
    });
}

exports.fdelete = (req, res) => {
    const id = req.params.id;
    const gyle = req.params.gyle;

    db.query(`DELETE FROM fermentation_records WHERE id = ${id} AND gyle = ${gyle}`, (err, results) => {
        if (err) {
            throw err;
        }
        _this.edit(req, res);
    });
}

exports.view = (req, res) => {

    const gyle = req.params.gyle;

    db.query(`SELECT * FROM brew WHERE gyle=${gyle}`, (err, data) => {
        if (err) {
            throw err;
        }
        if (data.length > 0) {
            db.query(`SELECT * FROM fermentation_records WHERE gyle=${gyle}`, (err, fdata) => {
                res.render('../views/view', {
                    message: `View Gyle ${gyle}`,
                    data,
                    fdata,
                    color: 'warning'
                });
            });
        } else {
            res.render('../views/tableData', {
                message: 'Data not found',
                color: 'danger'
            });
        }
    });
}