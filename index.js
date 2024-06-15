const express = require('express');
const app = express();
const port = 3000;
const pg = require('pg');
const cors = require('cors');

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

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

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
	console.log(`繋がったよ`)
});

app.use(express.json())
