const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

exports.creat = (req, res) => {
    res.send({ message: "creat handler"});
};
//Retrieve all contacts of a user from the database
exports.findAll = async (req, res, netx) => {
    let documents = [];

    try{
        const contactService = new ContactService(MongoDB.client);
        const{ name } = req.query;
        if(name){
            documents = await contactService.findByName(name);
        }
        else{
            documents = await contactService.find({});
        }
    } catch (error){
        return netx(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error){
        return netx(
            new ApiError(
                500, 
                'Error retrieving contacts with id=${req.params.id}'
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length == 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated successfully"});
    } catch (error){
        return netx(
            new ApiError(500, 'Error updating contact with id=${req.params.id}')
        );
    }
};

exports.delete = async (req, res) => {
     try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error){
        return netx(
            new ApiError(
                500, 
                'Could not delete contact with id=${req.params.id}'
            )
        );
    }
};

exports.deleteAll = async (req, res) => {
     try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.deleteAll();
        return res.send({
            message: '${deletedCount} contacts were deleted successfully',
        });
    } catch (error){
        return netx(
            new ApiError(500, 'An error occured while removing all contacts')
        );
    }
};

exports.findAllFavorite = async (req, res) => {
     try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findAllFavorite();
        return res.send(documents);
    } catch (error){
        return netx(
            new ApiError(
                500, 
                "An error occured while retrieving favorite contacts")
        );
    }
};

//Creat and Save a new Contact
exports.create = async(req, res, next) =>{
    if(!req.body?.name){
        return next(new ApiError(400, "Name can not be empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.creat(req.body);
        return res.send(document);
    } catch(error){
        return next(
            new ApiError(500, "An error occured while creating the contact")
        );
    }
}