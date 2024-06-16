const express = require('express');
const app = express();
const port = 3000;
const pg = require('pg');
const cors = require('cors');

const isDbLocal = ((process.env.PGHOST || "localhost") === "localhost");

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

const pool = new pg.Pool(getConfig());

app.get('/', (req, res) => {
	pool.connect( function(err, client) {
		if (err) {
			res.send(err);
		} else {
			client.query('SELECT * FROM books', function (err, result) {
				res.json(result.rows);
				console.log("GET accepted");
			});
		}
	});
});


app.get('/data/:id', (req, res) => {
	const id = req.params.id;
	console.log(id);
	var query = {
		text: 'SELECT * FROM books WHERE id = $1',
		values: [id],
	};
	pool.connect( function(err, client) {
		if (err) {
			res.send(err);
		} else {
			client.query(query, function (err, result) {
				res.json(result.rows);
				console.log(`GET accepted data:${id} returned`);
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
					console.log("Registered new bookdata.");
				})
				.catch((e) => {
					console.error(e.stack);
				});
		}
	});
});

app.listen(port, () => {
	console.log(`繋がったよ`)
});

app.use(express.json())
