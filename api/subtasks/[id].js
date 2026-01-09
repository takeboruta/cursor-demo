const subtaskController = require('../../controllers/subtaskController');

module.exports = async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    req.params = { id: req.query.id };

    if (req.method === 'GET') {
        return subtaskController.getById(req, res);
    } else if (req.method === 'PUT') {
        return subtaskController.update(req, res);
    } else if (req.method === 'DELETE') {
        return subtaskController.delete(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
