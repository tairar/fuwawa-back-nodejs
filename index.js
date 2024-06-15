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

app.listen(port, () => {
	console.log(`繋がったよ:http://localhost:${port}`)
});

app.use(express.json())
