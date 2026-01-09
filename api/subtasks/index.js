const subtaskController = require('../../controllers/subtaskController');

module.exports = async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        return subtaskController.create(req, res);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
