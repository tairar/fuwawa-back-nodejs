const express = require('express');
const app = express();
const port = 3000;
const pg = require('pg');

var pool = new pg.Pool({
	database: 'mydb',
	user: 'postgres',
	password: 'PASSWORD',
	host: 'localhost',
	port: 5432,
});

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

app.listen(port, () => {
	console.log(`繋がったよ:http://localhost:${port}`)
});

app.use(express.json())
