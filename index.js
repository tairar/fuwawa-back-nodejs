const express = require('express');
const app = express();
const port = 3000;
const pg = require('pg');

const isDbLocal = ((process.env.PGHOST || "localhost") === "localhost");

function getConfig() {
    if (isDbLocal) {
        return {
            max: 10
        };

    } else {
        return {
            max: 10,
            ssl: {
                rejectUnauthorized: false,
            }
        };
    }
}

const pool = new pg.Pool(getConfig());

app.get('/', (req, res) => {
	pool.connect( function(err, client) {
		if (err) {
			res.send(err);
		} else {
			client.query('SELECT * FROM books', function (err, result) {
				res.json(result.rows);
			});
		}
	});
});

app.use(express.json())
app.post('/regist', (req,res) => {
	var query = {
		text: 'INSERT INTO books (title, genre, content) VALUES($1, $2, $3)',
		values: [req.body.title, req.body.genre, req.body.content],
	};

	pool.connect( function(err, client) {
		if (err) {
			res.send(err);
		} else {
			client
				.query(query)
				.then(() => {
					res.json("Data Created.");
				})
				.catch((e) => {
					console.error(e.stack);
				});
		}
	});
});

app.listen(port, () => {
	console.log(`繋がったよ:http://localhost:${port}`)
});

app.use(express.json())
