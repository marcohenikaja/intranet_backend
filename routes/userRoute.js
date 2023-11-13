const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userControlleur')
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/medias'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});




const storage2 = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, './public/images'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});

const storage3 = multer.diskStorage({
   

    destination: function (req, file, cb) {
        cb(null, './public/imgserviceg'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});

const storage4 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imghsse'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});

const storage5 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgmark'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});

const storage6 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgsi'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});
const storage7 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgsupply'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});

const storage8 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgrh'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});

const storage9 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgaf'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});

const storage10 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgad'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});


const storage11 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imgdirsoc'); // Remplacez par le chemin de destination de votre choix
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Conservez le nom d'origine du fichier
    },
});



const upload = multer({ storage });
const upload2 = multer({ storage: storage2 });
const upload3 = multer({ storage: storage3 });
const upload4 = multer({ storage: storage4 });
const upload5 = multer({ storage: storage5 });
const upload6 = multer({ storage: storage6 });
const upload7 = multer({ storage: storage7 });
const upload8 = multer({ storage: storage8 });
const upload9 = multer({ storage: storage9 });
const upload10 = multer({ storage: storage10 });
const upload11 = multer({ storage: storage11 });


//get
router.get('/makamedia', ctrl.makamedia)
router.get('/makafichier', ctrl.makafichier)
router.get('/getcontact', ctrl.getcontact)
router.get('/getdir', ctrl.getdir)
router.get('/getImage', ctrl.getImage)
router.get("/getVideos", ctrl.getVideos)
router.get('/activate/:activationToken', ctrl.activateAccount);
router.get('/recupehsse', ctrl.recupehsse);
router.get('/recupemark', ctrl.recupemark);
router.get('/recupesi', ctrl.recupesi);
router.get('/getdirsoc', ctrl.getdirsoc);
router.get('/getAlluserliste', ctrl.getAlluserliste);

//getOrganigramme
router.get("/afficherPersonne", ctrl.afficherPersonne)
router.get("/nomsg", ctrl.nomsg)
router.get("/nomrsg", ctrl.nomrsg)
router.get("/nomvert", ctrl.nomvert)
router.get("/nomdhsse", ctrl.nomdhsse)
router.get("/nommark", ctrl.nommark)
router.get("/nomdsi", ctrl.nomdsi)
router.get("/nomsupply", ctrl.nomsupply)
router.get("/nomsdrh", ctrl.nomsdrh)
router.get("/nomdaf", ctrl.nomdaf)
router.get("/nomdhssev", ctrl.nomdhssev)
router.get("/nommarkv", ctrl.nommarkv)
router.get("/nomdsiv", ctrl.nomdsiv)
router.get("/nomsupplyv", ctrl.nomsupplyv)
router.get("/nomdrhv", ctrl.nomdrhv)
router.get("/nomdafv", ctrl.nomdafv)
router.get("/contintinvs", ctrl.contintinvs)
router.get("/nomtour", ctrl.nomtour)
router.get("/nomdethse", ctrl.nomdethse)
router.get("/nomdethssee", ctrl.nomdethssee)



router.get("/makamediaentrep", ctrl.makamediaentrep)
router.get("/makamediacollab", ctrl.makamediacollab)


router.get("/recupeservig", ctrl.recupeservig)
router.get("/recupesupply", ctrl.recupesupply)
router.get("/recuperh", ctrl.recuperh)
router.get("/recupeaf", ctrl.recupeaf)
router.get("/recupead", ctrl.recupead)
router.get('/fetchAll/:ids', ctrl.fetchAll)
router.get('/makamessjiaby/:id/:ids', ctrl.makamessjiaby)

//post
router.post('/insrciptionIntra', ctrl.insrciptionIntra)
router.post("/uploadImage", upload.single('image'), ctrl.UploadImage);
router.post("/UploadImageserviceg", upload3.single('image'), ctrl.UploadImageserviceg);
router.post("/UploadImagehsse", upload4.single('image'), ctrl.UploadImagehsse);
router.post("/UploadImagemark", upload5.single('image'), ctrl.UploadImagemark);
router.post("/UploadImagesi", upload6.single('image'), ctrl.UploadImagesi);
router.post("/UploadImagesupply", upload7.single('image'), ctrl.UploadImagesupply);
router.post("/UploadImagerh", upload8.single('image'), ctrl.UploadImagerh);
router.post("/UploadImageaf", upload9.single('image'), ctrl.UploadImageaf);
router.post("/UploadImagead", upload10.single('image'), ctrl.UploadImagead);
router.post("/UploadImagedirsoc", upload11.single('image'), ctrl.UploadImagedirsoc);
router.post('/envoyermess', ctrl.envoyermess)
router.post('/login', ctrl.login)
router.post('/Enregitrermedia', ctrl.Enregitrermedia)
router.post('/ajoutercontact', ctrl.ajoutercontact)
router.post('/ajouterdir', ctrl.ajouterdir)
router.post('/ajouterservig', ctrl.ajouterservig)
router.post('/ajouterhsse', ctrl.ajouterhsse)
router.post('/ajoutermark', ctrl.ajoutermark)
router.post('/ajoutersi', ctrl.ajoutersi)
router.post('/ajoutersupply', ctrl.ajoutersupply)
router.post('/ajouterrh', ctrl.ajouterrh)
router.post('/ajouteraf', ctrl.ajouteraf)
router.post('/ajouterad', ctrl.ajouterad)

router.post('/ajouterdirsoc', ctrl.ajouterdirsoc)





//postOrgannigramme
router.post("/uploadImage2", upload2.single('image'), ctrl.UploadImage2);
router.post("/ajouterPersonnes", ctrl.ajouterPersonnes)
router.post("/ajouterPersonne", ctrl.ajouterPersonne)

//delete
router.delete('/deleteuser/:id', ctrl.deleteuser)
router.delete('/deleteMedia/:id', ctrl.deleteMedia)
router.delete('/supprimerPersonnes/:id', ctrl.supprimerPersonnes)
router.delete('/suppridselected/:id', ctrl.suppridselected)
router.delete('/confsupprimerservg/:id', ctrl.confsupprimerservg)
router.delete('/confsupprimerhsse/:id', ctrl.confsupprimerhsse)
router.delete('/confsupprimermark/:id', ctrl.confsupprimermark)
router.delete('/confsupprimersupply/:id', ctrl.confsupprimersupply)
router.delete('/confsupprimerrh/:id', ctrl.confsupprimerrh)
router.delete('/confsupprimeraf/:id', ctrl.confsupprimeraf)
router.delete('/confsupprimerad/:id', ctrl.confsupprimerad)
router.delete('/supprarticle/:id', ctrl.supprarticle)
router.delete('/deletedir/:id', ctrl.deletedir)
router.delete('/confirmersuppression/:id', ctrl.confirmersuppression)



//deleteOrgannigramme
router.delete("/supprimerPersonne/:id", ctrl.supprimerPersonne)
router.delete("/confsupprimer/:id", ctrl.confsupprimer)


//modification 
router.put('/modif', ctrl.modif)
router.put('/modifmedia/:id', ctrl.modifmedia)
router.put('/modifperso/:id', ctrl.modifperso)
router.put('/updatedata/:id', ctrl.updatedata)
router.put('/updatedatas/:id', ctrl.updatedatas)
router.put('/updatedataservg/:id', ctrl.updatedataservg)
router.put('/updatedatahsse/:id', ctrl.updatedatahsse)
router.put('/updatedatamark/:id', ctrl.updatedatamark)
router.put('/updatedatasupply/:id', ctrl.updatedatasupply)
router.put('/updatedatarh/:id', ctrl.updatedatarh)
router.put('/updatedataaf/:id', ctrl.updatedataaf)
router.put('/updatedataad/:id', ctrl.updatedataad)
router.put('/manovaarticle/:id', ctrl.manovaarticle)
router.put('/validermodifications/:id', ctrl.validermodifications)
router.put('/autorisersuperadmin/:id', ctrl.autorisersuperadmin)
router.put('/autoriseradmin/:id', ctrl.autoriseradmin)
router.put('/autoriser/:id', ctrl.autoriser)
router.put('/valider/:id', ctrl.valider)



module.exports = router;
