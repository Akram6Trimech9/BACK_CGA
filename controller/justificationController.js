const asyncHandler = require('express-async-handler');
const Justification = require('../models/justification');

 exports.createJustification = asyncHandler(async (req, res) => {
    const { date, type, situationClient, avocatAssocie , natureJugement  } = req.body;

     if (type === 'Jugee') {
        const justificationData = {
            date,
            natureJugement,
            type,
            situationClient,
            avocatAssocie,
            copieJugement: req.copieJugement ? req.copieJugement.path : undefined  
        };

        const justification = await Justification.create(justificationData);
        res.status(201).json(justification);
    } else {
        res.status(400).json({ message: 'Justification type must be Jugee to create an entry.' });
    }
});

 exports.updateJustification = asyncHandler(async (req, res) => {
    const { justificationId } = req.params;
    const { date, type, situationClient, avocatAssocie  , natureJugement} =  req.body
 
 console.log(req.file,"file")

          const justificationData = {
            date,
            type,
            natureJugement,
            situationClient,
            avocatAssocie,
            copieJugement: req.file ? req.file.path : undefined 
        };
   

       
        const justification = await Justification.findByIdAndUpdate(justificationId, justificationData, {
            new: true,
            runValidators: true
        });

        if (!justification) {
            return res.status(404).json({ message: 'Justification not found' });
        }

        res.json(justification);
});

exports.getJustificationById = asyncHandler(async (req, res) => { 
 const {idJustification } = req.params
  try{
    const justification = await  Justification.findById(idJustification)
      if(justification){ 
        res.status(200).json(justification)
      }else{ 
         res.status(404).json({message : 'Justification not found '})
      }
  }catch(err){ 
    res.status(500).json(err)
  }
})

