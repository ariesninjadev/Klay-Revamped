
const collection_name = "gen"

const mongoose = require('mongoose');

// Connect to remote MongoDB database


mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://ariesninja:attobro08@birdstore.0wcwtae.mongodb.net/aal", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  account: {
    gsub: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    id: { type: String, required: true },
    creation: { type: Date, required: false },
    status: { type: Number, required: false },
    metadata: { type: {Object}, required: false }
  },
  data: {
    chats: {
      type: [Object],
      required: false
    },   
    friends: {
      type: [Object],
      required: false
    },   
    blocked: {
      type: [Object],
      required: false
    },
    pending: {
      type: [Object],
      required: false
    }
  },
  settings: {
    type: [Object],
    required: false
  }
},{ collection: 'users' });

const chatSchema = new mongoose.Schema({
  identifier: { type: String, required: false },
  chat: { type: [Object], required: false },
  members: { type: [String], required: false },
  type: { type: String, required: false },
  name: { type: String, required: false },
  cooldowns: { type: Object, required: false }
},{ collection: collection_name });

const User = mongoose.model('users', userSchema, 'users');

const ChatData = mongoose.model('gen', chatSchema);

function registerUser(gauth, idI, email) {
  const now = new Date();
  const newuser = new User({
    account: {
      gsub: gauth,
      email: email,
      username: "@UNSET",
      id: idI,
      creation: now,
      status: 1,
      metadata: {
        bandata: {
          bantext: ""
        }
      }
    },
    data: {
      chats: [],
      friends: [],
      blocked: [],
      pending: []
    },
    settings: []
  });
  newuser.save();
}

async function createDMOnGeneric(n1,n2) {
  const now = new Date();
  const newchat = new ChatData(
    {
    identifier: n1+"_"+n2,
    chat: [],
    members: [n1,n2],
    type: "d",
    name: "",
    cooldowns: {
      ping: {
        [n1]: now,
        [n2]: now
      }
    }
  }
  );
  newchat.save();
  return n1+"_"+n2
}


async function postChat(content,coll) {
  try {
    const result = await ChatData.updateOne(
      { "identifier": coll },
      {
        $push: {
          "chat": content
        },
      });

    return (result);

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function deleteChatObject(target) {
  try {
    var ids = target.split('_');
    const adxs = await ChatData.deleteOne({ "identifier": target });
    if (adxs.deletedCount === 1) {
        console.log("An admin deleted chat "+target);
    } else {
        console.log("Unknown target error!");
    }
    const result = await User.updateOne(
    { "account.id": ids[0] },
    {
      $pull: {
        "data.chats": {id:target}
      }
    });
    const result2 = await User.updateOne(
    { "account.id": ids[1] },
    {
      $pull: {
        "data.chats": {id:target}
      }
    });

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function clearChat(id) {
  try {
    const result = await ChatData.updateOne(
      { "identifier": id },
      {
      "chat": []
      });

    return (result);

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function clearAllChats() {
  try {
    const result = await ChatData.updateMany(
      {},
      {
        $set: { "chat": [] }
      });

    return result;

  } catch (err) {
    console.error(err);
    return false;
  }
}


async function requestChat(coll, startIndex) {
  try {
    const tuser = await User.findOne({"account.id": coll});
    const result = await ChatData.findOne({ "identifier": coll });
    if (!result) return false; 
    let amx = result.chat;

    if (startIndex >= 0 && startIndex < amx.length) {
      amx = amx.slice(startIndex);
    } else if (startIndex >= amx.length) {
      // If start index is greater than or equal to the length of amx, return an empty array
      return [];
    }

    return [amx.slice(-50), tuser];
  } catch (err) {
    console.error(err);
    return false;
  }
}

// returns 0 if the given username is found
async function chkUsername(usr) {
  try {
    const players = await User.find({});
    for (let i = 0; i < players.length; i++) {
      curref = players[i].account.username
      if (curref.toLowerCase() === usr.toLowerCase()) {
        return 0;
      }
    }
    return 1;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function vid(ide) {
  try {
    if (!ide) return false;
    const player = await User.findOne({ "account.gsub": ide });
    if (!player) return false;
    const code = player.account.username;
    return player;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function u2id(ide) {
  try {
    const player = await User.findOne({ "account.username": ide });
    if (!player) return false;
    return player.account.id;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// async function chkUsernameL(usr) {
//   try {
//     const player = await User.findOne({ "account.username": { $eq: usr } });
//     if (!player) return "NO_SUCH_PLAYERNAME_000000";
//     const code = player.account.cookie;
//     return code;
//   } catch f(err) {
//     console.error(err);
//     return false;
//   }
// }

// async function chkPasswordL(uid) {
//   try {
//     const player = await User.findOne({ "account.cookie": uid });
//     if (!player) return "NO_SUCH_ID_000000";
//     const code = player.account.hash;
//     return code;
//   } catch (err) {
//     console.error(err);
//     return false;
//   }
// }

async function requestUser(auth) {
  try {
    const result = await User.findOne({ "account.gsub": auth });
    if (!result) return false; 
    return result
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function idToName(ide) {
  try {
    const player = await User.findOne({ "account.id": ide });
    if (!player) return false;
    const code = player.account.username;
    return code;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function idToNameAndEmail(ide) {
  try {
    const player = await User.findOne({ "account.id": ide });
    if (!player) return false;
    return {"name":player.account.username,"email":player.account.email};
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function chatCheck(user,chatid) {
  try {
    const player = await ChatData.findOne({ "identifier": chatid });
    if (!player) return false;
    tempaspect = player.members
    if (tempaspect.includes(user)) {
      return(player)
    } else {
      return false
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function checkExists(user) {
  try {
    const player = await User.findOne({ "account.id": user });
    if (!player) return false;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function pendingSend(receiver,sender,type) {
  try {
    const result = await User.updateOne(
      { "account.id": receiver },
      {
        $push: {
          "data.pending": {receiver:type,user:sender}
        },
      });
    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function initChatA(receiver,sender,order) {
  try {
    var chatid;
    if (order) {
      chatid = sender+"_"+receiver;
    } else {
      chatid = receiver+"_"+sender;
      const uafd = await User.findOne({ "account.id": receiver });
      if (! uafd.data.friends.some(t => t.id == sender) || uafd.settings.allowChatsWithStrangers) {
        return false;
      }
    }
    const result = await User.updateOne(
      { "account.id": receiver },
      {
        $push: {
          
          "data.chats": {
            type:"d",
            members:[sender,receiver],
            status:0,
            id:chatid,
            viewdata:{
              startIndex:0,
              lastViewed:0
            }
          }
          
        },
      });
    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
}


async function frRespYes(responder,sender) {
  try {
    const result = await User.updateOne(
      { "account.id": responder },
      {
        $push: {
          "data.friends": {id:sender}
        },
        $pull: {
          "data.pending": {user:sender}
        }
      });
    const result2 = await User.updateOne(
      { "account.id": sender },
      {
        $push: {
          "data.friends": {id:responder}
        },
        $pull: {
          "data.pending": {user:responder}
        }
      });
    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function frRespNo(responder,sender) {
  try {
    const result = await User.updateOne(
      { "account.id": responder },
      {
        $pull: {
          "data.pending": {user:sender}
        }
      });
    const result2 = await User.updateOne(
      { "account.id": sender },
      {
        $pull: {
          "data.pending": {user:responder}
        }
      });
    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function chkInFriends(target,user) {
  try {
    const player = await User.findOne({"account.id": target});
    for (let i = 0; i < player.data.friends.length; i++) {
      curref = player.data.friends[i].id
      if (curref == user) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function chkInChats(target,user) {
  try {
    const player = await User.findOne({"account.id": target});
    return player.data.chats.some(chat => chat.members.includes(user));
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function removeFriend(user,friend) {
  try {

    const result = await User.updateOne(
    { "account.id": user },
    {
      $pull: {
        "data.friends": {id:friend}
      }
    });
    const result2 = await User.updateOne(
    { "account.id": friend },
    {
      $pull: {
        "data.friends": {id:user}
      }
    });

    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function shiftStartPointer(chatId_inherited, user_inherited, pointer) {
    try {
        const result = await User.updateOne(
            {
                "account.id": user_inherited,
                "data.chats": { $elemMatch: { id: chatId_inherited } }
            },
            {
                $set: {
                    "data.chats.$.viewdata.startIndex": pointer
                }
            }
        );
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function chkGoogleAuth(usr) {
  try {
    const player = await User.findOne({"account.gsub": usr});
    if (!player) return {new:true,auth:usr};
    return {new:false,auth:player.account.gsub};
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function onboardUser(auth, name) {
  try {
    const result = await User.updateOne(
      { "account.gsub": auth },
      {
        $set: {
          "account.username": name
        },
      });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function SSA(usr) {
  try {
    const player = await User.findOne({"account.gsub": usr});
    if (!player) return {status:"denied"};
    if (!(player.account.username == "@UNSET")) return {status:"denied"};
    return {status:"ok"};
  } catch (err) {
    console.error(err);
    return false;
  }
}

const pingCooldown = 5;

async function checkPing(chatId,userId) {
  try {
    const chat = await ChatData.findOne({"identifier": chatId});
    if (!chat) return {status:false,time:-1};
    const now = new Date();
    if (chat.cooldowns.ping[userId] < now) {
      const dTime = new Date(now.getTime() + pingCooldown * 60000);
      const result = await ChatData.updateOne(
        { "identifier": chatId },
        {
          $set: {
            [`cooldowns.ping.${userId}`]:dTime
          },
        });
        return {status:true,time:-1};
    } else {
      timeDiff = Math.ceil((chat.cooldowns.ping[userId].getTime() - now.getTime())/1000)
      return {status:false,time:timeDiff};
    }


  } catch (err) {
    console.error(err);
    return false;
  }
}

console.log("db active")

module.exports = { postChat, requestChat, clearChat, clearAllChats, registerUser, chkUsername, vid, u2id, chkGoogleAuth, requestUser, idToName, chatCheck, checkExists, pendingSend, frRespYes,frRespNo, chkInFriends, chkInChats, createDMOnGeneric, initChatA, deleteChatObject, removeFriend, shiftStartPointer, onboardUser, SSA, idToNameAndEmail, checkPing }

