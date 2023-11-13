const Sequelize = require('sequelize');
const { sequelize } = require('../db/db');

const UserInsrcription = sequelize.define('inscriptions', {
    nom: {
        type: Sequelize.STRING,
        collate: 'utf8_bin'
    },
    mot_de_passe: {
        type: Sequelize.STRING,
        collate: 'utf8_bin'
    },
    mail: {
        type: Sequelize.STRING,
        collate: 'utf8_bin'
    },
    poste: {
        type: Sequelize.STRING,
        collate: 'utf8_bin'
    },
    isActivated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false // Le compte n'est pas activé par défaut
    },
    activationToken: {
        type: Sequelize.STRING // Stockez ici le token d'activation unique
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    },
});

const Media = sequelize.define('media', {
    id_pers: {
        type: Sequelize.INTEGER
    },

    nom_pers: {
        type: Sequelize.STRING
    },
    titre: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    imageUrl: {
        type: Sequelize.STRING
    },

    service: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE
    }, updatedAt: {
        type: Sequelize.DATE
    },

});



const Contact = sequelize.define('contacts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mat: {
        type: Sequelize.STRING
    },
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    idUser: {
        type: Sequelize.INTEGER
    },
    service: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE
    }, updatedAt: {
        type: Sequelize.DATE
    },

});

const Personne = sequelize.define('personnes', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    genre: {
        type: Sequelize.STRING
    },
    numero: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});


const Perso = sequelize.define('persos', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

//ajouteer service generaux
const Serviceg = sequelize.define('ServiceGs', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },

    description: {
        type: Sequelize.STRING
    },
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

//hsse
const Hsse = sequelize.define('hsses', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },

    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
    ,
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});
//Mark
const Mark = sequelize.define('Marks', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
    ,
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

//si
const Si = sequelize.define('sis', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
    ,
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});
//supply
const Supply = sequelize.define('supply', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
    ,
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

//supply
const Rh = sequelize.define('rhs', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
    ,
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

//Af
const Af = sequelize.define('afs', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
    ,
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

//assistante de direction
const Ad = sequelize.define('ads', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.STRING
    },
    mail: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
    ,
    imageUrl: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

const Message = sequelize.define('messages', {
    id_send: {
        type: Sequelize.INTEGER
    },
    id_rec: {
        type: Sequelize.INTEGER
    },
    content: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});


const Dirsoc = sequelize.define('dirsocs', {
    nom: {
        type: Sequelize.STRING
    },
    prenom: {
        type: Sequelize.STRING
    },
    poste: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    },
    descri: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

const Histo_art =  sequelize.define('histo_arts', {
    nom_suppr: {
        type: Sequelize.STRING
    },
    id_pers_modif: {
        type: Sequelize.INTEGER
    },
    id_actus: {
        type: Sequelize.INTEGER
    },
    nom: {
        type: Sequelize.STRING
    },
  titre: {
        type: Sequelize.STRING
    },
   
    description: {
        type: Sequelize.STRING
    },
    actus: {
        type: Sequelize.STRING
    },
    titre_nouv: {
        type: Sequelize.STRING
    },
    description_nouv: {
        type: Sequelize.STRING
    },
    actus_nouv: {
        type: Sequelize.STRING
    },
    date_pub: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});
module.exports = {Histo_art ,Dirsoc, Message, Ad, Af, Rh, Supply, Si, Mark, Hsse, Serviceg, UserInsrcription, Media, Contact, Personne, Perso };
