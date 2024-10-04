const Message = require('../models/message');

exports.createMessage = async (req, res) => {
    try {
       const message = await Message.create({
        message: req .body.message,
        email: req.body.email, 
       
       });
      res.status(201).json({ message });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };



 exports.getMessageByIdUser = async (req, res) => {
    const {id} = req.params ;
     try {
       const  message = await Message.findOne({user:id});
        if (!message) {
            return res.status(404).json({ message: 'message not found' });
        } else{
            return res.status(200).json(message);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
  };

   
  exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({ message: 'mmessage not found' });
        }

         res.json({ message: 'message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMessgaeByEmail = async(req,res)=>{ 
    try{
       const {email} = req.params 
        const findedMessage = await  Message.find({email: email})
        if(!findedMessage){ 
           res.status(404).json({message : 'messages not found '})
        }else{ 
          res.status(200).json(findedMessage)
        }
    }catch(error) { 
        res.status(500).json(error)
    }
}

module.exports = exports;
