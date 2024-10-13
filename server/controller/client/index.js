const { query } = require('../../utils/database')

exports.search = async (req, res) => {
    try {
        const { status, category, organizer } = req.query;
        let sql = 'SELECT fundraiser.*, category.NAME FROM fundraiser JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID'
        if (status != undefined) {
            if (sql.includes('WHERE')) {
                sql += ' AND active = 1'
            } else {
                sql += ' WHERE ACTIVE = 1'
            }
        }
        if (category != undefined && category != null && category != 'null' && category != '') {
            if (sql.includes('WHERE')) {
                sql += ' AND fundraiser.CATEGORY_ID = :category'
            } else {
                sql += ' WHERE fundraiser.CATEGORY_ID = :category'
            }
        }
        if (organizer !== undefined && organizer !== '' && !organizer) {
            if (sql.includes('WHERE')) {
                sql += " AND ORGANIZER LIKE :organizer";
            } else {
                sql += " WHERE ORGANIZER LIKE :organizer";
            }
        }
        const result = await query(sql, { category, organizer })
        res.json({
            "code": 0,
            "data": result,
            "mag": "Success"
        })
    } catch (error) {
        res.json({
            "code": -1,
            "mag": "Error"
        })
    }
}

exports.category = async (req, res) => {
    try {
        const result = await query('SELECT * FROM category')
        res.json({
            "code": 0,
            "data": result,
            "mag": "Success"
        })
    } catch (error) {
        res.json({
            "code": -1,
            "mag": "Error"
        })
    }
    
}

exports.fundraiser = async (req, res) => {
    try {
        const { id } = req.params;
        let sql = 'SELECT fundraiser.*, category.NAME FROM fundraiser JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID WHERE fundraiser.FUNDRAISER_ID = :id';
        const result = await query(sql, { id });
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


exports.donateData = async (req, res) => {
    try {
        const { id } = req.params;
        let sql = 'SELECT * FROM DONATION WHERE FUNDRAISER_ID = :id';
        const result = await query(sql, { id });
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


exports.donation = async (req, res) => {
    try {
        const { id, amount, user, date, newCurrent } = req.body;
        const donateSql = 'INSERT INTO DONATION (GIVER, AMOUNT, DATE, FUNDRAISER_ID) VALUES ( :user, :amount, :date, :id )';
        const fundraiserSql = 'UPDATE FUNDRAISER SET CURRENT_FUNDING = :newCurrent WHERE FUNDRAISER_ID = :id';
        await query(donateSql, { user, amount, date, id }).then(async (error, result) => {
            await query(fundraiserSql, { newCurrent, id }).then((err, res) => {
                if (err) throw err;
                res.json(res);
            })
        })
    } catch (error) {
        res.json({
            code: -1,
            msg: 'Error'
        })
    }
}