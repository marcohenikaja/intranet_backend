const { Histo_art,Dirsoc, Ad, Af, Rh, UserInsrcription, Media, Contact, Personne, Perso, Serviceg, Hsse, Mark, Si, Supply, Message } = require('../models/userModel');
const { Sequelize, DataTypes, Op } = require('sequelize')
const nodemailer = require('nodemailer');
const { log } = require('console');
const ldap = require('ldapjs');

const getImage = async (req, res) => {
  try {
    const images = await Media.findAll({
      where: {
        [Sequelize.Op.or]: [
          { imageUrl: { [Sequelize.Op.like]: '%.png' } },
          { imageUrl: { [Sequelize.Op.like]: '%.jpg' } }
        ]
      }
    });
    const imageNames = images.map(image => image.imageUrl.split('/').pop());

    res.send(imageNames);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des images.' });
  }
};



const insrciptionIntra = async (req, res) => {


  const { nom, mot_de_passe, mail, poste } = req.body;

  // Vérifiez d'abord si l'adresse e-mail existe déjà dans la base de données
  const existingUser = await UserInsrcription.findOne({
    where: { mail },
  });
  const existingName = await UserInsrcription.findOne({
    where: { nom },
  });

  if (existingName) {
    return res.send({ message: "Le nom d'utilisateur existe déjà" });

  }

  if (existingUser) {
    return res.send({ message: "L'adresse e-mail existe déjà" });
  }

  // Si l'e-mail n'existe pas, vous pouvez continuer avec l'inscription normalement
  const activationToken = generateActivationToken();
  console.log(activationToken);

  try {
    const user = await UserInsrcription.create({
      nom,
      mot_de_passe,
      mail,
      poste,
      activationToken,
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'marcohenikajarakotobe@gmail.com',
        pass: 'lcnu lhmf hshq eymu',
      },
    });


    const mailOptions = {
      from: 'marcohenikajarakotobe@gmail.com',
      to: mail,
      subject: 'Sujet de l\'e-mail',
      text: 'Contenu de l\'e-mail',
      html: `<p>Cliquez sur ce lien pour activer votre compte : <a href="http://localhost:8000/activate/${activationToken}">Activer le compte</a></p>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('E-mail envoyé :', info.response);
      res.status(200).send('E-mail envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      res.status(500).send('Une erreur s\'est produite lors de l\'envoi de l\'e-mail');
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', error);
    res.status(500).send('Une erreur s\'est produite lors de l\'enregistrement de l\'utilisateur');
  }
};


const generateActivationToken = () => {
  const tokenLength = 32; // Longueur du jeton (peut être personnalisée)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
};

const activateAccount = async (req, res) => {
  const { activationToken } = req.params;

  try {
    // Recherchez l'utilisateur en fonction du jeton d'activation
    const user = await UserInsrcription.findOne({
      where: { activationToken },
    });

    if (!user) {
      return res.status(404).json({ error: 'Jeton d\'activation invalide.' });
    }

    // Mettez à jour le statut du compte pour l'activer
    user.isActivated = true;
    user.activationToken = null; // Effacez le jeton d'activation
    await user.save();

    // Redirigez l'utilisateur vers une page de confirmation d'activation
    return res.redirect('/activation.html');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'activation du compte.' });
  }
};




const getVideos = async (req, res) => {
  try {
    const videos = await Media.findAll({
      where: {
        imageUrl: {
          [Sequelize.Op.or]: [
            { [Sequelize.Op.like]: '%.mp4' },
            { [Sequelize.Op.like]: '%.avi' }
          ]
        }
      }
    });
    const videopure = videos.map(v => v.imageUrl.split('/').pop());
    res.json(videopure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des vidéos.' });
  }
};





const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserInsrcription.findOne({ where: { nom: username } });

    if (user) {
      // Vérifiez si l'utilisateur existe.

      if (user.mot_de_passe === password) {
        // Vérifiez si le mot de passe correspond.

        if (user.isActivated) {
          // Le compte est activé, renvoyer les informations de connexion réussie.
          res.status(200).json({ success: true, ids: user.id, login: user.nom, pwd: user.mot_de_passe, poste: user.poste });
        } else {
          // Le compte n'est pas activé.
          res.json({ success: false, message: 'Compte non activé. Veuillez vérifier votre boîte e-mail.' });
        }
      } else {
        // Le mot de passe est incorrect.
        res.json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
    } else {
      // L'utilisateur n'existe pas.
      res.json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion: ' + error.message });
  }
};


const UploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/medias/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }

};

const UploadImageserviceg = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgserviceg/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }

};

const UploadImagesi = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgsi/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }

};


const UploadImagerh = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgrh/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }

};

const UploadImagemark = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgmark/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }

};

const UploadImagehsse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imghsse/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }

};

const Enregitrermedia = async (req, res) => {
 

  try {
    const ids = req.body.ids;
    const imageUrl = req.body.imageUrl;
    const titre = req.body.titre;
    const service = req.body.pole;
    const description = req.body.description;
    const loggedInUser = req.body.loggedInUser;


    const insert = await Media.create({
      id_pers: ids,
      titre: titre,
      nom_pers: loggedInUser,
      service:service,
      description: description,
      imageUrl: imageUrl,
      service: service
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}

//bonplan
const makamedia = async (req, res) => {
  try {
    const mediaData = await Media.findAll();
    
    // Filtrer les résultats pour ne conserver que ceux ayant "service" égal à "Bons plans"
    const bonsPlansMedia = mediaData.filter(item => item.service === 'Bons plans');
    
    bonsPlansMedia.sort((a, b) => b.createdAt - a.createdAt);
    res.send(bonsPlansMedia);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite.");
  }
};

//Actus collaborateurs
const makamediacollab = async (req, res) => {
  try {
    const mediaData = await Media.findAll();
    
    // Filtrer les résultats pour ne conserver que ceux ayant "service" égal à "Actus collaborateurs"
    const actusCollaborateursMedia = mediaData.filter(item => item.service === 'Actus collaborateurs');
    
    actusCollaborateursMedia.sort((a, b) => b.createdAt - a.createdAt);
    res.send(actusCollaborateursMedia);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite.");
  }
};

//actus entreprises
const makamediaentrep = async (req, res) => {
  try {
    const mediaData = await Media.findAll();
    
    // Filtrer les résultats pour ne conserver que ceux ayant "service" égal à "Actus entreprises"
    const actusEntreprisesMedia = mediaData.filter(item => item.service === 'Actus entreprises');
    
    actusEntreprisesMedia.sort((a, b) => b.createdAt - a.createdAt);
    res.send(actusEntreprisesMedia);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite.");
  }
};




const makafichier = async (req, res) => {
  try {
    const mediaData = await Media.findAll({
      where: {
        [Op.or]: [
          { imageUrl: { [Op.like]: '%.pdf' } },   // Recherche les fichiers PDF
          { imageUrl: { [Op.like]: '%.xlsx' } },  // Recherche les fichiers XLSX
          { imageUrl: { [Op.like]: '%.xls' } },   // Recherche les fichiers XLS
          { imageUrl: { [Op.like]: '%.docx' } },  // Recherche les fichiers DOCX
          { imageUrl: { [Op.like]: '%.doc' } },   // Recherche les fichiers DOC
          { imageUrl: { [Op.like]: '%.txt' } },   // Recherche les fichiers TXT
        ],
      },
    });
    res.send(mediaData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite.");
  }
}

const ajoutercontact = async (req, res) => {

  try {
    const ajout = await Contact.create({
      mat: req.body.matricule,
      nom: req.body.nom,
      prenom: req.body.prenom,
      tel: req.body.telephone,
      mail: req.body.email,
      poste: req.body.role,
      idUser: req.body.ids,
      service: req.body.service
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }

}

const getcontact = async (req, res) => {
  try {
    const contact = await Contact.findAll();
    res.send({ success: true, contact })
  } catch (error) {

  }
}

const deleteuser = async (req, res) => {

  try {
    const userId = req.params.id;

    const deletedUser = await Contact.destroy({
      where: {
        id: userId,
      },
    });

    if (deletedUser) {
      res.send({ success: true, message: `Utilisateur avec l'ID ${userId} supprimé avec succès` });
    } else {
      res.status(404).send({ success: false, message: `Utilisateur avec l'ID ${userId} introuvable` });
    }
  } catch (error) {
    console.error(error);
  }
};


const confirmersuppression = async (req, res) => {

  try {
    const userId = req.params.id;

    const deletedir = await UserInsrcription.destroy({
      where: {
        id: userId,
      },
    });

    if (deletedir) {
      res.send({ success: true, message: `Utilisateur avec l'ID ${userId} supprimé avec succès` });
    } else {
      res.status(404).send({ success: false, message: `Utilisateur avec l'ID ${userId} introuvable` });
    }
  } catch (error) {
    console.error(error);
  }
};

const deletedir = async (req, res) => {

  try {
    const userId = req.params.id;

    const deletedir = await Dirsoc.destroy({
      where: {
        id: userId,
      },
    });

    if (deletedir) {
      res.send({ success: true, message: `Utilisateur avec l'ID ${userId} supprimé avec succès` });
    } else {
      res.status(404).send({ success: false, message: `Utilisateur avec l'ID ${userId} introuvable` });
    }
  } catch (error) {
    console.error(error);
  }
};

const modif = async (req, res) => {
  try {
    const { idup, matriculeup, nomup, prenomup, telup, mailup, roleup } = req.body;
    const contact = await Contact.update(
      {
        mat: matriculeup,
        nom: nomup,
        prenom: prenomup,
        tel: telup,
        mail: mailup,
        poste: roleup,
      },
      {
        where: {
          id: idup,
        },
      }
    );

    res.send({ success: true, contact });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Une erreur s'est produite lors de la modification du contact." });
  }
};




//organigramme 

const ajouterPersonne = async (req, res) => {
  const nom = req.body.noms;
  const prenom = req.body.prenoms;
  const genre = req.body.genre;
  const numero = req.body.num;
  const poste = req.body.poste;
  const mail = req.body.mail;
  const imageUrl = req.body.imageUrl;



  try {

    const inserer = await Personne.create({
      nom: nom,
      prenom: prenom,
      genre: genre,
      numero: numero,
      poste: poste,
      mail: mail,
      imageUrl: imageUrl
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
};

const ajouterPersonnes = async (req, res) => {
  const nom = req.body.noms;
  const prenom = req.body.prenoms;
  const genre = req.body.genre;
  const numero = req.body.num;
  const poste = req.body.poste;
  const mail = req.body.mail;
  const imageUrl = req.body.imageUrl;



  try {

    const inserer = await Personne.create({
      nom: nom,
      prenom: prenom,
      genre: genre,
      numero: numero,
      poste: poste,
      mail: mail,
      imageUrl: imageUrl
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
};


const afficherPersonne = async (req, res) => {
  try {
    const pers = await Personne.findAll();
    res.send(pers)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout de la classe' });
  }
}

const supprimerPersonne = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await Personne.findByPk(id); // Chercher l'utilisateur par l'ID
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await Personne.destroy(); // Supprimer l'utilisateur

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'utilisateur' });
  }
}


const UploadImage2 = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imageUrl = `/images/${req.file.filename}`;



    res.status(201).json(imageUrl);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

const nomsg = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: 'Secrétaire Général'
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
};

const nomrsg = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: 'Responsable SG'
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
};

const nomvert = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Coursier',
            'Femmes de Ménage',
            'Responsable Contrat Groupe',
            'Assistant achat interne',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
};
const nomdhsse = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: 'DHSSE'
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
};
const nommark = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: 'Directrice Marketing et Communication'
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
};

const nomdsi = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: `Directeur du Système d'Information`
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
};


const nomsupply = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: 'Directrice Supply Chain'
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nomsdrh = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: 'DRH'
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nomdaf = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: 'DAF'
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nomdhssev = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Responsable Service Audit',
            'Responsable Service Sureté',
            'Responsable HSE',
            'Assistante de direction hsse',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nommarkv = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Coordinateur Marketing-Détachée',
            'Responsable Communication',
            'Responsable Marketing',
            'Assistante de direction Marketing et Communication',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}



const nomdethssee = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Chantier',
            'Entrepôt',
            'Base principale NP AKADIN',
            'Base secondaire en région',
            'Accueil'
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nomdsiv = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            `Responsable Système d'information`,
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nomsupplyv = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Chef de Departement Opérations',
            'Chef de Departement Transit',
            'Chef de Departement Approvisionnement',
            'Assistante de direction Supply Chain',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}


const nomdrhv = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Contrôleur Interne',
            'Trésoriers',
            'ADMINISTRATION RH',
            'Responsable Développement RH/Recrutement',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nomdafv = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Assistante de direction DAF',
            'RAF',
            'Resp Contrôle de Gestion',
            'Resp Process & Contrôle interne',
            'Resp Trésorerie',
            'Resp Facturations & Recouvrements',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}


const contintinvs = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Contrôleur interne + Process',
            'Investigation',

          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}

const nomtour = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Surveillant tour de contrôl',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}
const nomdethse = async (req, res) => {
  try {
    const users = await Personne.findAll({
      where: {
        poste: {
          [Sequelize.Op.or]: [
            'Détaché HSE',
          ]
        }
      }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
}


const deleteMedia = async (req, res) => {
  const id = req.params.id;

  try {
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ message: 'Media non trouvé' });
    }

    await media.destroy(); // Supprimer le média

    res.status(200).json({ message: 'Media supprimé avec succès' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du média' });
  }
}

const modifmedia = async (req, res) => {
  const id = req.params.id;
  const titre = req.body.titrenew;
  const service = req.body.deps;
  
  try {
    const media = await Media.update(
      {
        titre: titre,
        service:service
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }

}
const ajouterdir = async (req, res) => {

  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const genre = req.body.genre;
  const numero = req.body.num;
  const poste = req.body.poste;
  const mail = req.body.mail;
  const imageUrl = req.body.imageUrl;



  try {
    const inserer = await Perso.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      imageUrl: imageUrl
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const ajouterdirsoc = async (req, res) => {


  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const poste = req.body.poste;
  const imageUrl = req.body.imageUrl;
  const descri = req.body.descri;

  try {
    const inserer = await Dirsoc.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      image: imageUrl,
      descri: descri
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const getdir = async (req, res) => {
  try {
    const getdir = await Perso.findAll();
    res.send(getdir);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite.");
  }
}
const getdirsoc = async (req, res) => {
  try {
    const getdirsoc = await Dirsoc.findAll();
    res.send(getdirsoc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite.");
  }
}


const ajoutersi = async (req, res) => {

  const { nom, prenom, poste, tel, mail, desc, imageUrlToSend } = req.body;
  try {
    const ServiceG = await Si.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      tel: tel,
      mail: mail,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}


const ajouterrh = async (req, res) => {

  const { nom, prenom, poste, desc, imageUrlToSend } = req.body;
  try {
    const Servicerh = await Rh.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}



const ajouteraf = async (req, res) => {

  const { nom, prenom, poste, desc, imageUrlToSend } = req.body;
  try {
    const Servicerh = await Af.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}


const ajouterservig = async (req, res) => {

  const { nom, prenom, poste, desc, imageUrlToSend } = req.body;
  try {
    const ServiceG = await Serviceg.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}


const ajouterhsse = async (req, res) => {

  const { nom, prenom, poste, desc, imageUrlToSend } = req.body;
  try {
    const ServiceG = await Hsse.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const ajoutermark = async (req, res) => {

  const { nom, prenom, poste, desc, imageUrlToSend } = req.body;
  try {
    const ServiceG = await Mark.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}



const ajoutersupply = async (req, res) => {

  const { nom, prenom, poste, desc, imageUrlToSend } = req.body;
  try {
    const ServiceG = await Supply.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}



const ajouterad = async (req, res) => {

  const { nom, prenom, poste, tel, mail, desc, imageUrlToSend } = req.body;
  try {
    const ServiceG = await Ad.create({
      nom: nom,
      prenom: prenom,
      poste: poste,
      tel: tel,
      mail: mail,
      description: desc,
      imageUrl: imageUrlToSend
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la personne:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}
const UploadImagesupply = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgsupply/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }


}

const UploadImageaf = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgaf/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
}

const UploadImagead = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgad/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
}

const UploadImagedirsoc = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
    const imageUrl = `/imgdirsoc/${req.file.filename}`;
    res.send({ imageUrl, success: true });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
}

const recupeservig = async (req, res) => {
  try {
    const Service = await Serviceg.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const recupemark = async (req, res) => {
  try {
    const Service = await Mark.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}
const recupehsse = async (req, res) => {
  try {
    const Service = await Hsse.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}
const recupesupply = async (req, res) => {
  try {
    const Service = await Supply.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const recupesi = async (req, res) => {
  try {
    const Service = await Si.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const recupead = async (req, res) => {
  try {
    const Service = await Ad.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}


const recuperh = async (req, res) => {
  try {
    const Service = await Rh.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const recupeaf = async (req, res) => {
  try {
    const Service = await Af.findAll();
    res.send(Service);
  } catch (error) {

    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la personne' });
  }
}

const fetchAll = async (req, res) => {
  const ids = req.params.ids;
  try {
    const fetch = await UserInsrcription.findAll({
      where: {
        id: {
          [Op.ne]: ids, // Cette condition signifie "pas égal à ids"
        },
      },
    });
    res.send(fetch);
  } catch (error) {
    console.log(error);
  }
}
const makamessjiaby = async (req, res) => {
  const id = req.params.id;
  const ids = req.params.ids;

  try {
    const sms = await Message.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ id_send: ids }, { id_rec: id }],
          },
          {
            [Op.and]: [{ id_send: id }, { id_rec: ids }],
          },
        ],
      },
      order: [['id', 'ASC']], // Tri par ID en ordre ascendant
    });

    res.send({ success: true, sms });
  } catch (error) {
    console.log(error);
  }
};

const envoyermess = async (req, res) => {
  try {
    const inserer = await Message.create({
      id_send: req.body.ids,
      id_rec: req.body.selectedPerson,
      content: req.body.mess,
    });

    res.send({ success: true });
  } catch (error) {

  }
}
const modifperso = async (req, res) => {

  const { nom, prenom, genre, numero, email } = req.body;

  try {
    const modifperso = await Personne.update(
      {
        nom: nom,
        prenom: prenom,
        genre: genre,
        numero: numero,
        mail: email,

      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}

const validermodifications = async (req, res) => {
  const { nom, prenom, poste, descri } = req.body;
  try {
    const modifperso = await Dirsoc.update(
      {
        nom: nom,
        prenom: prenom,
        poste: poste,
        descri: descri,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}

const autorisersuperadmin = async (req, res) => {

  try {
    const modifperso = await UserInsrcription.update(
      {

        poste: "Super admin",

      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}
const autoriseradmin = async (req, res) => {

  try {
    const modifperso = await UserInsrcription.update(
      {

        poste: "Administrateur",

      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}


const autoriser = async (req, res) => {

  try {
    const modifperso = await UserInsrcription.update(
      {

        poste: "Utilisateur",

      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}


const suppridselected = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Perso.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const confsupprimer = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Personne.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedata = async (req, res) => {
  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Si.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}

const updatedatas = async (req, res) => {

  const idup = req.params.id;
  try {
    const { nom, prenom, poste } = req.body
    const up = await Perso.update(
      {
        nom: nom,
        prenom: prenom,
        poste: poste,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}


const supprimerPersonnes = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await Si.findByPk(id); // Chercher l'utilisateur par l'ID
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Utilisez l'option "where" pour spécifier la condition de suppression
    await Si.destroy({
      where: {
        id: id // Supprimer l'utilisateur avec l'ID correspondant
      }
    });

    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'utilisateur' });
  }
};


const confsupprimerservg = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Serviceg.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedataservg = async (req, res) => {
  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Serviceg.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}


const confsupprimerhsse = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Hsse.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedatahsse = async (req, res) => {
  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Hsse.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}



const confsupprimermark = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Mark.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedatamark = async (req, res) => {
  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Mark.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}

const confsupprimersupply = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Supply.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedatasupply = async (req, res) => {

  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Supply.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}



const confsupprimerrh = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Rh.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedatarh = async (req, res) => {

  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Rh.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}


const confsupprimeraf = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Af.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedataaf = async (req, res) => {

  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Af.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}


const confsupprimerad = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Ad.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}

const updatedataad = async (req, res) => {

  const idup = req.params.id;
  try {
    const { nomup, prenomup, posteup, mailup, telup, descup } = req.body
    const up = await Ad.update(
      {
        nom: nomup,
        prenom: prenomup,
        poste: posteup,
        tel: telup,
        mail: mailup,
        description: descup,
      },
      {
        where: {
          id: idup,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}

const manovaarticle = async (req, res) => {
  console.log(req.body); 
  const idup = req.params.id;
  try {
    const { titre, description ,pole,nom} = req.body
    const up = await Media.update(
      {
        titre: titre,
        description: description,
        service:pole
      },
      {
        where: {
          id: idup,
        },
      }, 
    );

    const ins = await  Histo_art.create({ 
      titre_nouv : titre,
      description_nouv:description,
      actus_nouv:pole,
     nom: nom,
      id_actus:idup,
    })
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }

}



const supprarticle = async (req, res) => {
  const id = req.params.id;

  try {
    const confsupprimer = await Media.destroy({
      where: {
        id: id,
      },
    });
    res.send({ success: true })
  } catch (error) {
    console.log(error);

  };
}


const getAlluserliste = async (req, res) => {
  try {
    const allUserList = await UserInsrcription.findAll({
      where: {
        isActivated: 1 // Filtrer les enregistrements où isActivated est égal à 1
      },
      order: [['createdAt', 'DESC']] // Remplacez 'createdAt' par le nom de votre champ de date.
    });
    res.send(allUserList);
  } catch (error) {
    console.log(error);
    res.status(500).send('Une erreur s\'est produite.');
  }
}


const valider = async (req, res) => {
  const { nom, mail, poste } = req.body;

  try {
    const mod = await  Media.update(
      {
        nom_pers: nom,

      },
      {
        where: {
          id_pers: req.params.id,
        },
      }
    )
    const modifperso = await UserInsrcription.update(
      {
        nom: nom,

        mail: mail,
        poste: poste

      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send({ success: true })
  } catch (error) {
    console.log(error);
  }
}




module.exports = {makamediaentrep,makamediacollab, confirmersuppression, valider, autoriser, autoriseradmin, autorisersuperadmin, deletedir, validermodifications, getAlluserliste, getdirsoc, ajouterdirsoc, UploadImagedirsoc, nomdethssee, nomdethse, nomtour, supprarticle, manovaarticle, confsupprimerad, updatedataad, confsupprimeraf, updatedataaf, confsupprimerrh, updatedatarh, confsupprimersupply, updatedatasupply, confsupprimermark, updatedatamark, confsupprimerhsse, updatedatahsse, updatedataservg, confsupprimerservg, suppridselected, updatedatas, supprimerPersonnes, updatedata, confsupprimer, modifperso, envoyermess, makamessjiaby, fetchAll, ajouterad, recupead, UploadImagead, recupeaf, ajouteraf, UploadImageaf, recuperh, ajouterrh, UploadImagerh, recupesupply, ajoutersupply, UploadImagesupply, recupesi, UploadImagesi, ajoutersi, recupemark, UploadImagemark, ajoutermark, recupehsse, ajouterhsse, UploadImagehsse, recupeservig, UploadImageserviceg, ajouterservig, activateAccount, getVideos, getImage, getdir, ajouterdir, insrciptionIntra, login, UploadImage, Enregitrermedia, makamedia, makafichier, ajoutercontact, getcontact, deleteuser, modif, nomsg, ajouterPersonne, modifmedia, afficherPersonne, supprimerPersonne, UploadImage2, nomsg, nomrsg, ajouterPersonnes, nomvert, nomdhsse, nommark, nomdsi, nomsupply, nomsdrh, nomdaf, nomdhssev, nommarkv, nomdsiv, nomsupplyv, nomdrhv, nomdafv, contintinvs, deleteMedia };
