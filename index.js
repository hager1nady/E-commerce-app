
import express from 'express'
import { config } from 'dotenv'
import dbConnection from './DB/connectionDB.js'
import * as router from './src/modules/index.js'
import { globaleResponse } from './src/middleware/error-handling.middleware.js'




let port = 3000
const app = express()
app.use(express.json())
app.use('/category',router.categoryRouter)
app.use('/brand',router.brandRouter)
app.use('/subCategory',router.subCategoryRouter)
app.use('product',router.productRouter)
config()

app.use(globaleResponse)



dbConnection()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))