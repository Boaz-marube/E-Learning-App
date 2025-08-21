// src/models/FileAsset.ts
import { Schema, model, Document, Types } from "mongoose";


export type DocType = "assignment" | "notes" | "resource" | "avatar" | "lesson-asset";
export type StorageProvider = "cloudinary" | "s3" | "gcs" | "firebase";


export interface IFileAsset extends Document {
ownerId: Types.ObjectId; // uploader (user)
courseId?: Types.ObjectId; // optional link to course
docType: DocType; // business context
provider: StorageProvider; // which storage
url: string; // public or signed URL
publicId?: string; // provider id (e.g. Cloudinary public_id, S3 key)
fileName: string;
contentType: string; // MIME
size: number; // bytes
checksum?: string; // optional integrity check (e.g., md5/sha256)
createdAt: Date;
updatedAt: Date;
}


const FileAssetSchema = new Schema<IFileAsset>(
{
ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
courseId: { type: Schema.Types.ObjectId, ref: "Course" },
docType: { type: String, required: true },
provider: { type: String, required: true },
url: { type: String, required: true },
publicId: String,
fileName: { type: String, required: true },
contentType: { type: String, required: true },
size: { type: Number, required: true },
checksum: String,
},
{ timestamps: true }
);


export default model<IFileAsset>("FileAsset", FileAssetSchema);