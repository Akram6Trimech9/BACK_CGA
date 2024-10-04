const Documents = require('../models/documents');

exports.createDocument = async (req, res) => {
    try {
        const { filename, path, mimetype, size } = req.file;
  
       const document = await Documents.create({
        title: req.body.title,
        category: req.body.category, 
        description: req.body.description,
        file: path,  
       });
      res.status(201).json({ document });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

 exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Documents.find();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

 exports.getDocumentById = async (req, res) => {
    const {id} = req.params

     try {
       const  document = await Documents.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }else{
            return res.status(200).json(document);

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
  };

exports.updateDocument = async (req, res) => {
    try {
      const { id } = req.params;
      const document = await Documents.findById(id);
  
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      if (req.body.title != null) {
        document.title = req.body.title;
      }
      if (req.body.category != null) {
        document.category = req.body.category;
      }
      if (req.body.description != null) {
        document.description = req.body.description;
      }
      if (req.body.files != null) {
        document.files = req.body.files.map(file => file.path);
      }
  
      const updatedDocument = await document.save();
      res.json(updatedDocument);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Documents.findByIdAndDelete(id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

         res.json({ message: 'Document deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = exports;
