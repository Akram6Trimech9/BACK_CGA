const mongoose = require('mongoose');
const Affaire = require('../models/affaire');
const Delai = require('../models/delai');

async function checkReminders() {
  try {
    const affairs = await Affaire.find()
      .populate('audiances')
      .populate('aboutissement')
      .populate('folder');

    for (const affair of affairs) {
      const { audiances, degre, aboutissement, category, statusClient, dateDemande, folder } = affair;

      await checkDegreeDeadlines(audiances, degre, aboutissement, folder.avocat, affair._id, category, statusClient, dateDemande , folder.client);
      await handleUpcomingAudiences(affair, folder.avocat, category, statusClient);
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

async function checkDegreeDeadlines(audiances, degre, aboutissement, avocatId, affaireId, category, statusClient, dateDemande ,client) {
  if (category === 'pénale' && aboutissement && aboutissement.natureJugement === 'presence') {
    const checkDate = aboutissement.date || aboutissement.dateAppel || aboutissement.dateCassation;
    if (checkDate) {
       const daysRemaining = Math.floor((checkDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysRemaining >= 0 && daysRemaining <= 10) {
        const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'judgment' });
        if (!existingDelai) {
          await Delai.create({ avocatId, affaireId, type: 'judgment', daysRemaining  , clientId : client });
        }
      }
    }
  } else if (category === 'civil') {
    for (const audiance of audiances) {
      const dateR = Math.floor((audiance.dateAudiance.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      let type;

      if (audiance.type === 'Plaidoirie') {
        type = 'plaidoirie';
        if ((statusClient === 'plaignant' && dateR === 12) || (statusClient === 'accuse' && dateR === 5)) {
          const existingDelai = await Delai.findOne({ avocatId, affaireId, audianceId: audiance._id, type , clientId : client  });
          if (!existingDelai) {
            await Delai.create({ avocatId, affaireId, type, category:'plaidoirie', daysRemaining: dateR, audianceId: audiance._id , clientId : client  });
          }
        }
      } else if (audiance.type === 'Première audience' && dateR === 21) {
        type = 'premiere_audience';
        const existingDelai = await Delai.findOne({ avocatId, affaireId, audianceId: audiance._id, type  , clientId : client   });
        if (!existingDelai) {
          await Delai.create({ avocatId, affaireId, type, category: 'convocation', daysRemaining: dateR, audianceId: audiance._id , clientId : client  });
        }
      }
        else if (audiance.type === 'Première audience' && dateR === 10) {
      type = 'premiere_audience';
      const existingDelai = await Delai.findOne({ avocatId, affaireId, audianceId: audiance._id, type , clientId : client  });
      if (!existingDelai) {
        await Delai.create({ avocatId, affaireId, type, category: 'publication', daysRemaining: dateR, audianceId: audiance._id , clientId : client  });
      }
      }   
    }
    

    if (degre === 'appel' && aboutissement && aboutissement.date) {
      const daysAfterJudgment = Math.floor((Date.now() - aboutissement.date.getTime()) / (1000 * 60 * 60 * 24));
      const daysAfterConvocation = Math.floor((Date.now() - aboutissement.dateConvocation.getTime()) / (1000 * 60 * 60 * 24));

      if(aboutissement.type==='Jugement Primaire' ){
  const dateInformation = Math.floor((Date.now() - aboutissement.dateInformation.getTime()) / (1000 * 60 * 60 * 24));
 
  if(dateInformation === 18){
    const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'appel'  , category:'information' , clientId : client });
    if (!existingDelai) {
      await Delai.create({ avocatId, affaireId, type: 'appel', category:'information' , daysRemaining: 0  , clientId : client    });
    }
   }
}

      if (daysAfterConvocation && daysAfterConvocation === 25  ) {
        const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'appel'  , category:'convocation', clientId : client   });
        if (!existingDelai) {
          await Delai.create({ avocatId, affaireId, type: 'appel' ,  category:'convocation', daysRemaining: 0 });
        }
      }
    } else if (degre === 'cassation' && dateDemande) {
      const daysSinceDemand = Math.floor((Date.now() - new Date(dateDemande).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceDemand === 28) {
        const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'cassation' });
        if (!existingDelai) {
          await Delai.create({ avocatId, affaireId, type: 'cassation', category:'cassation' , daysRemaining: 0   });
        }
      }
    }
    
  }
}

async function handleUpcomingAudiences(affair, avocatId, category, statusClient) {
  const today = Date.now();
  if (category === 'civil') {
    const upcomingAudiences = affair.audiances.filter(audiance => {
      const daysRemaining = Math.floor((audiance.dateAudiance.getTime() - today) / (1000 * 60 * 60 * 24));
      return daysRemaining >= 0 && daysRemaining <= 23;
    });

    for (const audience of upcomingAudiences) {
      const daysRemaining = Math.floor((audience.dateAudiance.getTime() - today) / (1000 * 60 * 60 * 24));
      const existingDelai = await Delai.findOne({ avocatId, affaireId: affair._id, audianceId: audience._id, type: 'audience' });
      if (!existingDelai) {
        await Delai.create({ avocatId, affaireId: affair._id, type: 'audience', daysRemaining, audianceId: audience._id });
      }
    }
  }
}

module.exports = checkReminders;
