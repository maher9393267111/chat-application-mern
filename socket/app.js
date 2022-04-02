const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];
const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some((u) => u.userId === userId);

  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};
const userRemove = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const findFriend = (id) => {
  return users.find((u) => u.userId === id);
};

const userLogout = (userId) => {
  users = users.filter((u) => u.userId !== userId);
};

io.on("connection", (socket) => {
  console.log("Socket is connecting.....");
  console.log(users,'////////////')
  socket.on("addUser", (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit("getUser", users); // active users

    const us = users.filter((u) => u.userId !== userId);
    const con = "new_user_add";
    for (var i = 0; i < us.length; i++) {
      socket.to(us[i].socketId).emit("new_user_add", con);
    }
  });
  socket.on("sendMessage", (data) => {

    console.log(data,'--------->')
    const user = findFriend(data.reseverId);
     console.log("hiii friend send mesagae", user);
    if (user !== undefined) {
      socket.to(user.socketId).emit("getMessage", data);
    }
  });
  

  socket.on("messageSeen", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("msgSeenResponse", msg);
    }
  });

  socket.on("delivaredMessage", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("msgDelivaredResponse", msg);
    }
  });
  socket.on("seen", (data) => {
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("seenSuccess", data);
    }
  });

  socket.on("typingMessage", (data) => {
        const user = findFriend(data.reseverId);
    

        console.log('hi user------->',user)
    if (user !== undefined) {
      socket.to(user.socketId).emit("typingMessageGet", {
        senderId: data.senderId,
        reseverId: data.reseverId,
        msg: data.msg,
      });
    }
  });

  socket.on("logout", (userId) => {
    userLogout(userId);
  });

  socket.on("disconnect", () => {
    console.log("user is disconnect... ");
    //userRemove(socket.id);
    io.emit("getUser", users);
  });
});






// //console.log('hello socket')

// const io = require("socket.io")(8000, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// const users = [];
// const addUser = (userId, socketId, userInfo) => {
//   const checkUser = users.some((u) => u.userId === userId);
//   console.log(checkUser, "cheeeeek");
//   if (!checkUser) {
//     users.push({ userId, socketId, userInfo });
//     console.log("new user pushed into room ---->", userInfo);
//     //  console.log(users);
//   } else {
//     console.log("user is existttt ------>", users);
//   }
// };

// const userRemove = (socketId) => {
//   const users = users.filter((u) => u.socketId !== socketId);
// };

// // fiend message reciver user and send sendMessage Data to him
// const findFriend = (id) => {
//   console.log(id, "find friend");
//   console.log("whereee id ", users);
//   return users.find((u) => u.userId === id);
// };

// //senderId: maher ---> 62449605c2a138518f483af2
// //reseverId: majd ---> 62456190c7270bf800a5efa1

// io.on("connection", (socket) => {
//   // console.log("Socket is connecting...");
//   console.log("----------->>>>", users);
//   socket.on("addUser", (userId, userInfo) => {
//     //  console.log(userInfo)
//     // recive auth user info from client
//     addUser(userId, socket.id, userInfo);

//     io.emit("getUser", users);
//   });

//   socket.on("sendMessage", (data) => {
//     //  console.log('message data--->',data)

//     const user = findFriend(data.reseverId);
//     console.log(user, "user in socket ");

//     if (user !== undefined) {
//       console.log("message sende to onother--->", data);
//       socket.to(user.socketId).emit("getMessage", { data });
//     }
//   });

//   // message typing

//   socket.on("typingMessage", (data) => {
//     console.log("type------>", data);
//     const user = findFriend(data.reseverId);
//     console.log(user, "????");

//     if (user !== undefined) {
//       console.log("typiiing---->", user);
//       socket.to(user.socketId).emit("typingMessageGet", {
//         senderId: data.senderId,
//         reseverId: data.reseverId,
//         msg: data.msg,
//       });
//     }
//   });

//   // when user offline and go out

//   socket.on("disconnect", () => {
//     console.log("user is disconnect... ");
//     userRemove(socket.id);
//     io.emit("getUser", users);
//   });
// });
