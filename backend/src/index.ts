import express from "express";
import cors from "cors";
import { battlesRouter } from "./battles";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/battles", battlesRouter);

app.get("/api/health", (_req: import("express").Request, res: import("express").Response) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});