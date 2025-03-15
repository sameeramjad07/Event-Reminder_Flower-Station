import mongoose, { Schema, type Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  time?: string;
  location?: string;
  type: string;
  customType?: string;
  user: mongoose.Types.ObjectId;
  attendees?: string[];
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String },
    type: { type: String, required: true },
    customType: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attendees: [{ type: String }],
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
