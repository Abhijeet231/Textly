import mongoose, { type HydratedDocument } from "mongoose";


// Image type
interface IImage {
    url: string;
    public_id : string;
}

// Defining Interface for message
interface IMessage {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    text ?: string;
    images ?: IImage[];
    seenBy: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;

}

type MessageDocument = HydratedDocument<IMessage>;


// Defining Message schema
const messageSchema = new mongoose.Schema <IMessage>({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        minlength: [1, "Text should be at least 1 character long!"]
    },
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        },
    ],
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

}, { timestamps: true });

// Indexing for sorting chats
messageSchema.index({ conversationId: 1, createdAt: -1 });

// Message Verification
messageSchema.pre("save", function () {
  if (!this.text && (!this.images || this.images.length === 0)) {
    throw new Error("Message must have text or at least one image");
  }
});

const Message = mongoose.model <IMessage>("Message", messageSchema)

export default Message;