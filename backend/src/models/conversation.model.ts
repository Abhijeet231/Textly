import mongoose from "mongoose";


// INterface for conversation
interface IConversation {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    text?: string;
    senderId: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Defining Conversation schema 
const conversationSchema = new mongoose.Schema({
    participants:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
    ],
    lastMessage : {
        text: {type: String},
        senderId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdAt: {type: Date},
    },

}, {timestamps: true})

// Indexing
conversationSchema.index({participants: 1});

const Conversation = mongoose.model<IConversation> ("Conversation", conversationSchema);


export default Conversation;