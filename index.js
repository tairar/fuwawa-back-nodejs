const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const isDbLocal = ((process.env.PGHOST || "localhost") === "localhost");

// PostgreSQLへの接続設定
function getConfig() {
    if (isDbLocal) {
        return {
            max: 50
        };
    } else {
        return {
            max: 50,
            ssl: {
                rejectUnauthorized: false,
            }
        };
    }
}

app.use(cors());
app.use(express.json());

// 環境変数を用いてコネクションプールを設定
const pool = new Pool(getConfig());

// 書籍データ全件取得
app.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM books');
            res.json(result.rows);
            console.log("GET accepted");
        } finally {
            client.release();
        }
    } catch (err) {
        res.send(err);
    }
});

// 指定のidの書籍情報を取得
app.get('/data/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = {
        text: 'SELECT * FROM books WHERE id = $1',
        values: [id],
    };
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(query);
            res.json(result.rows);
            console.log(`GET accepted data:${id} returned`);
        } finally {
            client.release();
        }
    } catch (err) {
        res.send(err);
    }
});

// 書籍データの登録
app.post('/regist', async (req, res) => {
    const query = {
        text: 'INSERT INTO books (title, genre, content) VALUES($1, $2, $3)',
        values: [req.body.title, req.body.genre, req.body.content],
    };
    try {
        const client = await pool.connect();
        try {
            await client.query(query); 
            res.json("Data Created.");
            console.log("Registered new bookdata.");
        } finally {
            client.release();
        }
    } catch (err) {
        res.send(err);
    }
});

app.listen(port, () => {
    console.log(`繋がったよ`);
});

