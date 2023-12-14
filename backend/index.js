import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express();

const db = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"ishbaleric",
	database:"aqi_entry"
});

app.use(express.json());
app.use(cors());


app.get("/", (req,res)=>{
	const q = "SELECT * FROM entries"
	db.query(q,(err, data)=>{
		if(err) return res.json(err);
		return res.json(data);
	});
});

app.post("/", (req,res) => {
	const q = "INSERT INTO entries (`pm2_5`,`VOC_index`,`temperature`,`humidity`) VALUES (?)";
	const values = [
		req.body.pm2_5,
		req.body.VOC_index,
		req.body.temperature,
		req.body.humidity,
	];

	db.query(q,[values], (err,data)=>{
		if(err) return res.json(err);
		return res.json("Entry added succesfully!");
	});
});

app.delete("/:id", (req,res) => {
	const entryId = req.params.id;
	const q = "DELETE FROM entries WHERE id = ?";

	db.query(q, [entryId], (err,data) =>{
		if(err) return res.json(err);
		return res.json("Entry deleted succesfully!");
	})
});

app.listen(8800, ()=>{
	console.log("Connected to backend!");
});