const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});


messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });


messageSchema.statics.getConversations = async function(userId) {
  const conversations = await this.aggregate([
    // Trouver tous les messages où l'utilisateur est expéditeur ou destinataire
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { recipient: mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    // Trier par date de création (plus récent d'abord)
    { $sort: { createdAt: -1 } },
    // Grouper par conversation (combinaison unique d'expéditeur et destinataire)
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", mongoose.Types.ObjectId(userId)] },
            "$recipient",
            "$sender"
          ]
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [
                { $eq: ["$recipient", mongoose.Types.ObjectId(userId)] },
                { $eq: ["$read", false] }
              ]},
              1,
              0
            ]
          }
        }
      }
    },
   
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'otherUser'
      }
    },
   
    { $unwind: "$otherUser" },
    
    {
      $project: {
        _id: 1,
        otherUser: {
          _id: 1,
          name: 1,
          photo: 1
        },
        lastMessage: {
          content: 1,
          createdAt: 1,
          sender: 1
        },
        unreadCount: 1
      }
    },

    { $sort: { "lastMessage.createdAt": -1 } }
  ]);
  
  return conversations;
};


messageSchema.statics.getMessages = async function(userId, otherUserId, limit = 20, skip = 0) {
  const messages = await this.find({
    $or: [
      { sender: userId, recipient: otherUserId },
      { sender: otherUserId, recipient: userId }
    ]
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate('sender', 'name photo')
  .lean();
  
  return messages.reverse();
};


messageSchema.statics.markAsRead = async function(userId, otherUserId) {
  return this.updateMany(
    { sender: otherUserId, recipient: userId, read: false },
    { $set: { read: true } }
  );
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
