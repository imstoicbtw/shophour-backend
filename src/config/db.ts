import * as mongoose from "mongoose";

export async function connectDb(URI: string): Promise<void> {
    try {
        const {connection} = await mongoose.connect(URI);
        console.log(`Connected to "${connection.name}" database at "${connection.host}:${connection.port}/${connection.name}"`);
    } catch (error) {
        console.log("Database connection failed!", error);
        process.exit(1);
    }
}