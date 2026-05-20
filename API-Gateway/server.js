const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL || 'http://localhost:3002';

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const authResponse = await axios.get(`${AUTH_SERVICE_URL}/auth/validate`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (authResponse.data.isTokenValid) {
            req.user = authResponse.data.user;
            next();
        } else {
            res.status(403).json({ message: "Token is invalid or expired." });
        }
    } catch (error) {
        console.error("JWT Validation Error:", error.message);
        res.status(401).json({ message: "Failed to validate token." });
    }
};

app.use('/api/auth', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${AUTH_SERVICE_URL}/auth${req.path}`,
            params: req.query,
            data: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Auth service error" });
    }
});

app.use('/api/products', authenticateToken, async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${CATALOG_SERVICE_URL}/products${req.path}`,
            params: req.query,
            data: req.body,
            headers: { 'user-id': req.user.id, 'user-name': req.user.username }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 503).json(error.response?.data || { message: "Catalog service error" });
    }
});

app.use('/api/files', authenticateToken, async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${FILE_SERVICE_URL}/files${req.path}`,
            params: req.query,
            data: req.body,
            headers: { ...req.headers, 'user-id': req.user.id, 'user-name': req.user.username }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 503).json(error.response?.data || { message: "File service error" });
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});