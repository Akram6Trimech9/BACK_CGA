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
       const { audiances, degre, aboutissement, category, statusClient, dateDemande, folder  , dateConvocation} = affair;
      await checkDegreeDeadlines(audiances, degre, aboutissement, folder.avocat, affair._id, category, statusClient, dateDemande , folder.client , dateConvocation);
      // await handleUpcomingAudiences(affair, folder.avocat, category, statusClient);
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}
async function checkDegreeDeadlines(audiances, degre, aboutissement, avocatId, affaireId, category, statusClient, dateDemande, client , dateConvocation) {
  if (category === 'pénale' && aboutissement && aboutissement.natureJugement === 'presence') {
    const checkDate = aboutissement?.date || aboutissement?.dateAppel || aboutissement?.dateCassation;
 
    if (checkDate) {
      const daysRemaining = Math.floor(Math.abs((checkDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))+1;
       if ( daysRemaining >= 1  &&  daysRemaining <= 10  && degre === 'appel') {
        const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'appel' , category: 'appel' ,  clientId: client });
        if (!existingDelai) {
          await Delai.create({ avocatId, affaireId, type: 'appel', category: 'appel' ,  daysRemaining, clientId: client });
        }
      }else if(daysRemaining >= 1 && daysRemaining  <= 27  && degre === 'cassation'){

        if(daysRemaining >= 10){
          const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'cassation' , category: 'cassation' ,  clientId: client });
          if (!existingDelai) {
            await Delai.create({ avocatId, affaireId, type: 'cassation', category: 'cassation' ,  daysRemaining, clientId: client });
          }
        }else{ 
          const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'documentation' , category: 'documentation' ,  clientId: client });
          if (!existingDelai) {
            await Delai.create({ avocatId, affaireId, type: 'documentation', category: 'documentation' ,  daysRemaining, clientId: client });
          }
        }
        
      } 
      
    }
  } else if (category === 'civil') {

    for (const audiance of audiances) {
      const dateAudiance = audiance?.dateAudiance;
      if (dateAudiance) {
        const dateR = Math.floor((dateAudiance.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + 1;
        let type;

        if (audiance.type === 'plaidoirie') {
          type = 'plaidoirie';
          if ((statusClient === 'plaignant' && dateR === 12) || (statusClient === 'accuse' && dateR === 5)) {
            const existingDelai = await Delai.findOne({ avocatId, affaireId, audianceId: audiance._id, type, clientId: client });
            if (!existingDelai) {
              await Delai.create({ avocatId, affaireId, type, category: 'plaidoirie', daysRemaining: dateR, audianceId: audiance._id, clientId: client });
            }
          }
        } else if (audiance.type === 'Première audience' && dateR === 21) {
          type = 'premiere_audience';
          const existingDelai = await Delai.findOne({ avocatId, affaireId, audianceId: audiance._id, type, clientId: client, category: 'convocation' });
          if (!existingDelai) {
            await Delai.create({ avocatId, affaireId, type, category: 'convocation', daysRemaining: dateR, audianceId: audiance._id, clientId: client });
          }
        } else if (audiance.type === 'Première audience' && dateR === 10) {
          type = 'premiere_audience';
          const existingDelai = await Delai.findOne({ avocatId, affaireId, audianceId: audiance._id, type, clientId: client, category: 'publication' });
          if (!existingDelai) {
            await Delai.create({ avocatId, affaireId, type, category: 'publication', daysRemaining: dateR, audianceId: audiance._id, clientId: client });
          }
        }
      }
    }

    if (degre === 'appel') {
      const daysAfterJudgment = aboutissement && aboutissement.date ? Math.floor((Date.now() - aboutissement.date.getTime()) / (1000 * 60 * 60 * 24)) : null;
      const daysAfterConvocation = Math.floor(Math.abs(dateConvocation.getTime() - Date.now()) / (1000 * 60 * 60 * 24));


      if (aboutissement?.dateInformation) {
        const dateInformation = Math.floor(Math.abs( aboutissement.dateInformation.getTime()  -Date.now()  ) / (1000 * 60 * 60 * 24)) + 1;

        if (dateInformation >=1 && dateInformation <=18 ) {
          const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'appel', category: 'information', clientId: client });
          if (!existingDelai) {
            await Delai.create({ avocatId, affaireId, type: 'appel', category: 'information', daysRemaining: 0, clientId: client });
          }
        }
      }
       if (daysAfterConvocation && daysAfterConvocation >= 1  &&  daysAfterConvocation <=25) {
        const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'appel', category: 'convocation', clientId: client });
        if (!existingDelai) {
          await Delai.create({ avocatId, affaireId, type: 'appel', category: 'convocation', daysRemaining: 0  , clientId: client});
        }
      }
      for (const audiance of audiances) {
        if (audiance.type === 'plaidoirie') {
          type = 'plaidoirie';
          if ((statusClient === 'plaignant' && dateR === 12) || (statusClient === 'accuse' && dateR === 5)) {
            const existingDelai = await Delai.findOne({ avocatId, affaireId, audianceId: audiance._id, type, clientId: client });
            if (!existingDelai) {
              await Delai.create({ avocatId, affaireId, type, category: 'plaidoirie', daysRemaining: dateR, audianceId: audiance._id, clientId: client });
            }
          }
        }
      }
    } else if (degre === 'cassation' && dateDemande) {
      const daysSinceDemand = Math.floor(Math.abs(( new Date(dateDemande).getTime() - Date.now()  ) / (1000 * 60 * 60 * 24)));
  
      if (daysSinceDemand >= 1 && daysSinceDemand <= 28) {
        const existingDelai = await Delai.findOne({ avocatId, affaireId, type: 'cassation'  , category: 'cassation' ,  clientId: client });
        if (!existingDelai) {
          await Delai.create({ avocatId, affaireId, type: 'cassation', category: 'cassation', daysRemaining: 0 ,   clientId: client  });
        }
      }
    }
  }
}



// async function handleUpcomingAudiences(affair, avocatId, category, statusClient) {
//   const today = Date.now();
//   if (category === 'civil') {
//     const upcomingAudiences = affair.audiances.filter(audiance => {
//       const daysRemaining = Math.floor((audiance.dateAudiance.getTime() - today) / (1000 * 60 * 60 * 24));
//       return daysRemaining >= 0 && daysRemaining <= 23;
//     });

//     for (const audience of upcomingAudiences) {
//       const daysRemaining = Math.floor((audience.dateAudiance.getTime() - today) / (1000 * 60 * 60 * 24));
//       const existingDelai = await Delai.findOne({ avocatId, affaireId: affair._id, audianceId: audience._id, type: 'audience' });
//       if (!existingDelai) {
//         await Delai.create({ avocatId, affaireId: affair._id, type: 'audience', daysRemaining, audianceId: audience._id });
//       }
//     }
//   }
// }

module.exports = checkReminders;
