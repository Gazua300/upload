const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const db = require('./connection/connection')
const app = express()
const port = process.env.PORT || 3003



app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(fileUpload())


app.post('/upload', async(req, res)=>{
    var statusCode = 400
    try{

        const { name, data } = req.files.pic

        if(!name || !data){
            statusCode = 401
            throw new Error('File not found!')
        }

        await db('imageUpload').insert({
            name,
            image: data
        })


        res.status(200).send('File was uploaded sucessfully')
    }catch(e){
        res.status(statusCode).send(e.message || e.sqlMessage)
    }
})


app.get('/file', async(req, res)=>{
    var statusCode = 400
    try{

        const images = await db('imageUpload')

        
        res.status(200).send(images)
    }catch(e){
        res.status(statusCode).send(e.message || e.sq.Message)
    }
})


app.get('/file/:id', async(req, res)=>{
    var statusCode = 400
    try{

        const [file] = await db('imageUpload').select('image').where({
            id: req.params.id
        })

        if(!file){
            statusCode = 404
            throw new Error('File not found!')
        }

        res.status(200).send(file)
    }catch(e){
        res.status(statusCode).send(e.message || e.sqlMessage)
    }
})


app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})

