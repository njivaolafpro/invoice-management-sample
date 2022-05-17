const clients = require("../dataset/clients");

const clientNotFoundError = ()=>{
    const err = new Error('Client Not Found');
    err.statusCode = 404;
    return err;
}


/**
 * @param {String} id 
 */
const getClientById = (id) => {
    const clientFound = clients.find((client)=> client.clientId === id);
    if (!clientFound){
        throw clientNotFoundError()
    }
    return clientFound;
}

module.exports = { getClientById }
