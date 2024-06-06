const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { cardModel } = require("./model/flashcard.module");
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/", (req, res) => {
    res.send("Home page");
});

app.post("/addCard", async (req, res) => {
    const {groupName,description,image,cards}= req.body
    try {
        const card = await new cardModel({groupName,description,image,cards})
        await card.save()
        console.log("added success");
        res.send("card added")
    } catch (error) {
        res.send({"msg":"cannot save in db", "error":error.message})
    }
})

app.get("/cards",async(req,res)=>{
try {
    const data= await cardModel.find({}).sort({ createdAt: -1 })
    res.send(data)
} catch (error) {
    res.send({"msg":"cannot save in db", "error":error.message})
}
})

app.get("/card/:id",async(req,res)=>{
    const { id } = req.params;
try {
    const data= await cardModel.find({_id:id})
    res.send(data)
} catch (error) {
    res.send({"msg":"cannot save in db", "error":error.message})
}
})

app.delete("/cards/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCard = await cardModel.findByIdAndDelete(id);
      if (!deletedCard) {
        return res.status(404).send({ msg: "Card not found" });
      }
      const data = await cardModel.find({})
      res.send({ msg: "Card deleted successfully", data: data });
    } catch (error) {
      res.send({ msg: "Cannot delete the card", error: error.message });
    }
  });

app.listen(8080, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log("Cannot connect to DB");
        console.log(error.message);
    }
    console.log("Server running at port 8080");
});
