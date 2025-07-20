import {HydratedDocument, Model, model, Schema} from "mongoose";

interface IMediaRawDoc {
    name: string;
    alt: string;
    url: string;
    size: number;
    format: "image" | "video" | "pdf";
}

interface IMediaMethods {
}

interface IMediaVirtuals {
}

type TMediaModel = Model<IMediaRawDoc, {}, IMediaMethods, IMediaVirtuals>;
export type TMedia = HydratedDocument<IMediaRawDoc, IMediaMethods & IMediaVirtuals>;

const mediaSchema: Schema = new Schema<IMediaRawDoc, TMediaModel, IMediaMethods, {}, IMediaVirtuals>({
    name: {
        type: String,
        required: [true, "Media name is required."],
    },
    alt: {
        type: String,
        required: [true, "Media alt text is required for SEO and accessibility."],
    },
    url: {
        type: String,
        required: [true, "Media url is required."],
    },
    size: {
        type: Number,
        required: [true, "Media size is required."],
    },
    format: {
        type: String,
        required: [true, "Media format is required."],
        enum: {
            values: ["image", "video", "pdf"],
            message: "{VALUE} is not a valid media format.",
        },
    }
}, {timestamps: true});


export default model<IMediaRawDoc, TMediaModel, IMediaMethods>("Media", mediaSchema);