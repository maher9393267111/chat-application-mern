const router = require('express').Router();

const {auth} = require('../middleware/authNiddlware')
const {getFriends,messageUploadDB,messageGet,ImageMessageSend} = require('../controllers/messengerController');

router.get('/get-friends',auth,getFriends);

//send message

router.post('/send-message',auth, messageUploadDB);


router.get('/get-message/:id',auth, messageGet);

router.post('/image-message-send',auth, ImageMessageSend);

module.exports = router;