const taskController = require('../../../controllers/taskController');

module.exports = async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    req.params = { id: req.query.id };

    if (req.method === 'PATCH') {
        return taskController.toggleComplete(req, res);
    } else {
        res.setHeader('Allow', ['PATCH']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
