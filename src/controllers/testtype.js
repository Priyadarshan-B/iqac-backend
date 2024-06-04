const db = require("../config/database");


exports.getTestType = (req,res)=>{
    const query = `SELECT id,type FROM test_type WHERE status = '1'`;
  db.query(query,(err,rows)=>{
    if(err){
        res.status(500).send('Error in retrieving test types');
        console.log('Error in retrieving test types');
    }
    else{
        res.json(rows);
    }
    console.log(rows);
  })
}
