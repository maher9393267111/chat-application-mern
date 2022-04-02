const User = require("../models/authModel");

const messageModel = require("../models/messageModel");
const formidable = require("formidable");
const fs = require("fs");
const { CLIENT_RENEG_LIMIT } = require("tls");



const getLastMessage = async(myId, fdId) => {
     const msg = await messageModel.findOne({
          $or: [{
               $and: [{
                    senderId : {
                        $eq: myId
                    }
               },{
                    reseverId : {
                        $eq : fdId 
                    }
               }]
          }, {
               $and : [{
                    senderId : {
                         $eq : fdId
                    } 
               },{
                    reseverId : {
                         $eq : myId
                    }
               }]
          }]

     }).sort({
          updatedAt : -1
     });
     return msg;
}





module.exports.getFriends = async (req, res) => {
  const myId = req.userId;
  //  console.log(myId)
  try {
        
     let fnd_msg = [];
//db.contributor.find({salary: {$not: {$gt: 2000}}}).pretty()
    const friendGet = await User.find({_id: {$not:{$eq: myId}},});
    for (let i = 0; i < friendGet.length; i++ ){
     let lmsg = await getLastMessage(myId,friendGet[i].id);
     //  ...fnd_msg,
     fnd_msg = [ ...fnd_msg, {
          fndInfo : friendGet[i],
          msgInfo : lmsg
     }]
     
}

console.log(fnd_msg)


   // const filter = friendGet.filter((d) => d.id !== myId);
    //    console.log(filter)
    res.status(200).json({ success: true, friends: fnd_msg });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};

module.exports.messageUploadDB = async (req, res) => {
  const { senderName, reseverId, message } = req.body;
  const senderId = req.userId;
  //  const senderemail = req.user.email
  // console.log('req body ------>>',req.body)

  try {
    const insertMessage = await messageModel.create({
      senderId: senderId,
      senderName: senderName,
      reseverId: reseverId,
      //    email:senderemail,
      message: {
        text: message,
        image: "",
      },
    });
    //  console.log(insertMessage.email,'------> okk email')
    res.status(201).json({
      success: true,
      message: insertMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};

module.exports.messageGet = async (req, res) => {
  const myId = req.userId;
  const fdId = req.params.id;
  console.log(fdId, "friend id ===========>");

  try {
    let getAllMessages = await messageModel.find({
      $or: [
        {
          $and: [{ senderId: { $eq: myId } }, { reseverId: { $eq: fdId } }],
        },
        { $and: [{ senderId: { $eq: fdId } }, { reseverId: myId }] },
      ],
    });

//     let getAllMessage = getAllMessages.filter(
//       (m) =>
//         (m.senderId === myId && m.reseverId === fdId) ||
//         (m.reseverId === myId && m.senderId === fdId)
//     );

    //console.log(getAllMessage)

    res.status(200).json({
      success: true,
      message: getAllMessages,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server error",
      },
    });
  }
};

// image recive

module.exports.ImageMessageSend = (req, res) => {
  const senderId = req.userId;
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    const { senderName, reseverId, imageName } = fields;

    //  console.log('fields',fields)
    const newPath =
      __dirname +
      `../../../client/public/image/${files.image.originalFilename}`;
    //    const newPath = __dirname + `../../../client/public/image/${imageName}`
    console.log(newPath, "<===++++++++");
    //   files.image.originalFilename = imageName;
    //console.log(files,'image data-------->')
    try {
      fs.copyFile(files.image.filepath, newPath, async (err) => {
        if (err) {
          res.status(500).json({
            error: {
              errorMessage: "Image upload fail",
            },
          });
        } else {
          const insertMessage = await messageModel.create({
            senderId: senderId,
            senderName: senderName,
            reseverId: reseverId,
            message: {
              text: "",
              image: files.image.originalFilename,
              // files.image.newFilename
            },
          });
          console.log(insertMessage, "image-------->");
          res.status(201).json({
            success: true,
            message: insertMessage,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: "Internal Sever Error",
        },
      });
    }
  });
};
