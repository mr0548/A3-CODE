const { query } = require('../../utils/database')
const fs = require('fs')
const upload = require('../../utils/upload.js')

exports.addFunfraiser = async (req, res) => {
    try {
        const { organizer, caption, target, city, status, category, describe, url } = req.body;
        const category_id = Number(category)
        const sql = 'INSERT INTO FUNDRAISER (`ORGANIZER`, `CAPTION`, `TARGET_FUNDING`, `CITY`, `ACTIVE`, `CATEGORY_ID`, `DESCRIBE`, `URL`) VALUES (:organizer, :caption, :target, :city, :status, :category_id, :describe, :url)';
        const result = await query(sql, { organizer, caption, target, city, status, category_id, describe, url })
        res.json({
            "code": 0,
            "data": result,
            "mag": "Success"
        })
    } catch (error) {
        res.json({
            code: -1,
            msg: 'Error'
        })
    }
}


exports.updateFunfraiser = async (req, res) => {
    try {
        const { id, organizer, caption, target, city, status, category, describe, url } = req.body;
        const category_id = Number(category)
        const sql = 'UPDATE FUNDRAISER SET `ORGANIZER` = :organizer, `CAPTION` = :caption, `TARGET_FUNDING` = :target, `CITY` = :city, `ACTIVE` = :status, `CATEGORY_ID` = :category_id, `DESCRIBE` = :describe, `URL` = :url WHERE FUNDRAISER_ID = :id'
        const result = await query(sql, { organizer, caption, target, city, status, category_id, describe, url, id })
        res.json({
            "code": 0,
            "data": result,
            "mag": "Success"
        })
    } catch (error) {
        res.json({
            code: -1,
            msg: 'Error'
        })
    }
}


exports.removeFundraiser = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = :id';
        const result = await query(sql, { id })
        res.json({
            "code": 0,
            "data": result,
            "mag": "Success"
        })
    } catch (error) {
        res.json({
            code: -1,
            msg: 'Error'
        })
    }
}

exports.uploadImage = async (req, res) => {
    upload(req, res)
        .then(imgSrc => {
            res.json({
                "code": 0,
                "msg": "string",
                'data': imgSrc
            })
        })
        .catch(err => {
            console.log(err)
        })
}


exports.checkImage = async (req, res) => {
    const cs = fs.createReadStream(`./file/${req.params[0]}`)
    cs.on('data', chunk => {
        res.write(chunk)
    })
    cs.on('end', () => {
        res.end()
    })
}