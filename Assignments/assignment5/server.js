import express from 'express'
import cors from 'cors'
const app=express();
app.use("/files",express.static("files"));

app.listen(5000,() => {
    console.log("server running on 5000");
});