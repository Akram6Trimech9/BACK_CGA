const Rdv = require('../models/rdv');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const socket = require('socket.io-client')("http://localhost:3000/");
const Notification = require('../models/notifications');
const mongoose = require('mongoose');
const { sendEmailWithAttachments } = require('../services/emailService');
const Guest = require('../models/guest');

const createRdvByGuest = asyncHandler(async (req, res) => {
    const { avocatId } = req.params;
    const { firstName, lastName, email, displonibilty, reservationTime , number } = req.body;

     const guest = new Guest({
        firstName,
        lastName,
        email: email || '',
        number,
    });

    const savedGuest = await guest.save();

     const rdv = new Rdv({
        avocats: avocatId,
        displonibilty: displonibilty,
        reservationTime: reservationTime,
        guest: savedGuest._id,   
        rdvBy: 'guest'
    });

    const createRdv = await rdv.save();

     const avocat = await User.findById(avocatId);
    if (!avocat) {
        return res.status(404).json({ message: "Avocat (lawyer) not found" });
    }

    const notification = new Notification({
        message: "A new appointment has been created by a guest",
        avocat: avocat._id,
    });

    try {
        const notificationCreated = await notification.save();
        if (notificationCreated) {
            await socket.emit('rdv-created', { clientId: avocat._id, notification: notificationCreated });
        }
    } catch (err) {
        return res.status(400).json({ message: 'Error creating the notification' });
    }

    return res.status(201).json(createRdv);
});
 const createRdv = asyncHandler(async (req, res) => {
    const { userId , avocatId } = req.params;

    const rdv = new Rdv({
        avocats: avocatId,
        displonibilty:req.body.displonibilty,
        reservationTime:req.body.reservationTime,
        user:userId
    })
    const createRdv = await rdv.save()
    const updateUser = await User.findByIdAndUpdate(
        userId,
        { $push: { rendezVous: rdv._id } },
        { new: true }
    );
    const updateAvocat = await User.findByIdAndUpdate(
        avocatId,
        { $push: { clients: userId } },
        { new: true }
    );
    if (!updateUser || !updateAvocat) {
        return res.status(500).json({ message: "Échec de la mise à jour de l'utilisateur" });
    }

    rdv.user = updateUser._id;
    await rdv.save();

    const admin = await User.findById(avocatId);
    if (!admin) {
        return res.status(404).json({ message: "Administrateur introuvable" });
    }

    const notification = new Notification({
        message: "Le rendez-vous a été créé",
        avocat: admin._id,
    });

    try {
        const notificationCreated = await notification.save();
        if (notificationCreated) {
            await socket.emit('rdv-created', { clientId: admin._id, notification: notificationCreated });
        }
    } catch (err) {
        return res.status(400).json({ message: 'Erreur lors de la création de la notification' });
    }

    return res.status(201).json(createRdv);
});




const getAllRdvs = asyncHandler(async (req, res) => {
    const { avocatId } = req.params;  
    try {
        const rdvs = await Rdv.find({ avocats: avocatId }).populate('user displonibilty guest') ;
        if (rdvs && rdvs.length > 0) {
            res.status(200).json(rdvs);
        } else { 
            res.status(404).json({ message: 'Aucun rendez-vous trouvé pour cet avocat' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error });
    }
});

 const getRdvById = asyncHandler(async (req, res) => {
    const rdv = await Rdv.findById(req.params.id).populate('user' );
    if (!rdv) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    res.json(rdv);
});

 const updateRdv = asyncHandler(async (req, res) => {
    const rdv = await Rdv.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rdv) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    res.json(rdv);
});

 const deleteRdv = asyncHandler(async (req, res) => {
    const rdv = await Rdv.findByIdAndDelete(req.params.id);
    if (!rdv) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    res.json({ message: "Rendez-vous supprimé avec succès" });
});

 const getRdvByUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rdvs = await Rdv.find({ user: id }).populate('user').populate('avocats');
    if (!rdvs || rdvs.length === 0) {
        return res.status(404).json({ message: "Aucun rendez-vous trouvé pour l'utilisateur" });
    }
    res.json(rdvs);
});

 const acceptRdv = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rdv = await Rdv.findByIdAndUpdate(
        id,
        { status: 'accepted' },
        { new: true }
    ).populate('user');

    if (!rdv) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    const path = "templates/rdv-created.html";
    await sendEmailWithAttachments(
        rdv.user.email,
        'akramtrimech97@gmail.com',
        'Rendez-vous accepté',
        path,
        null,
        "resetURL"
    );

    const notification = new Notification({
        message: "Votre rendez-vous a été confirmé",
        user: rdv.user._id,
        rdv: rdv
    });

    notification.save().then(notificationCreated => {
        if (notificationCreated) {
            socket.emit('rdv-confirmed', { clientId: rdv.user._id, notification: notificationCreated });
        } else {
            return res.status(400).json({ message: "Échec de la confirmation du rendez-vous" });
        }
    }).catch(err => {
        return res.status(400).json({ message: "Erreur lors de la création de la notification" });
    });

    res.json(rdv);
});

 const refuseRdv = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rdv = await Rdv.findByIdAndUpdate(
        id,
        { status: 'refused' },
        { new: true }
    );

    if (!rdv) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res.json(rdv);
});

module.exports = {
    createRdv,
    getAllRdvs,
    getRdvById,
    updateRdv,
    deleteRdv,
    acceptRdv,
    refuseRdv,
    createRdvByGuest,
    getRdvByUser
};
