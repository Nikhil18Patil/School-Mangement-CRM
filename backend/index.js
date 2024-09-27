const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000

dotenv.config();


app.use(express.json({ limit: '10mb' }))
app.use(cors({
    origin: 'https://school-mangement-crm-nikhil18patils-projects.vercel.app'
  }));

mongoose
    .connect('mongodb+srv://nikhilpatil18012004:uwhDOeNA5gVL9M4J@cluster0.yoy3k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})