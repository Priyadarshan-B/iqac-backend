const { post_query_database } = require("../../../config/database_utils")

exports.post_course_category = (req, res)=>{
    const {name} = req.body
    if(!name){
        res.status(400).json({
            error:"Course category is required"
        })
    }
    const query = `INSERT INTO course_category(name, status)
    VALUES('${name}', '1')`
    const error_message = "Failed to add course category"
    const success_message = "Course category added successfully"

    post_query_database(query, res, error_message, success_message)
}