const app = require("./app");
const transactionRoutes = require("./routes/transactionRoute");

const PORT = 5000;
app.use("/api/transaction", transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});