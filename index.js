require('dotenv').config();
const express = require("express")
const app = express()
require('./config/dbConnect')();
const userRoute = require('./routes/user/userRoute')

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Node Mailer Task Backend")
})
app.use("/vjemailtask", userRoute)

const PORT = process.env.PORT || 8000 ;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})