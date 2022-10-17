const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password:  process.env.PASSWORD,
    database: process.env.DATABASE
});

exports.insert = (req, res) => {
    const { brewer, beer, gyle, fv } = req.body;
    const { mashIn, copperUp, mashTemp, gravity_after_boil, setTaps, dip_after_boil, first_runnings, dip_in_liquor, last_runnings, wort_pH, collection_dip } = req.body;
    const { issue_no, action_mashing_liquor, action_glass_audit, action_racking_tank, action_fermenter, action_auger_grain_chute, action_trailer, action_premasher, action_mash_tun_plates, action_copper, action_pipes_paraflow } = req.body;
    const { hoursFermentation, tempFermentation, gravityFermentation, tasteFermentation } = req.body;
    
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
        }
        
        // Insert into brew table
        db.query(`INSERT INTO brew (brewer, beer, gyle, date, fv, mashIn, copperUp, mashTemp, gravity_after_boil, setTaps, dip_after_boil, first_runnings, dip_in_liquor, last_runnings, wort_pH, collection_dip, issue_no, action_mashing_liquor, action_glass_audit, action_racking_tank, action_fermenter, action_auger_grain_chute, action_trailer, action_premasher, action_mash_tun_plates, action_copper, action_pipes_paraflow, hoursFermentation, tempFermentation, gravityFermentation, tasteFermentation ) VALUES ( '${brewer}', '${beer}', '${gyle}', '${date}', '${fv}', '${mashIn}', '${copperUp}', '${mashTemp}', '${gravity_after_boil}', '${setTaps}', '${dip_after_boil}', '${first_runnings}', '${dip_in_liquor}', '${last_runnings}', '${wort_pH}', '${collection_dip}', '${issue_no}', '${action_mashing_liquor}', '${action_glass_audit}', '${action_racking_tank}', '${action_fermenter}', '${action_auger_grain_chute}', '${action_trailer}', '${action_premasher}', '${action_mash_tun_plates}', '${action_copper}', '${action_pipes_paraflow}', '${hoursFermentation}', '${tempFermentation}', '${gravityFermentation}', '${tasteFermentation}')`, (err, results) => {
            if (err) {
                throw err;
            }
            message += 'Brew added successfully';
            return res.render('../views/register', {
                message,
                color: 'warning'
            });
        });
    });
}