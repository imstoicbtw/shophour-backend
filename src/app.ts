import express, {Express, Request, Response} from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js";
import {authRouter} from "./routes/auth.routes.js";
import {userRouter} from "./routes/user.routes.js";
import {productRouter} from "./routes/product.routes.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.all("/", (_req: Request, res: Response): void => {
    res.json({success: true});
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.all(/\/*/, (_req: Request, res: Response): void => {
    res.status(404).json({success: false, message: "Route not found"});
});


app.use(errorMiddleware);

export default app;