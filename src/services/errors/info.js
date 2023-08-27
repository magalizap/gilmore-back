export const generateProductErrorInfo = (prod) => {
    return (
        'One or more properties were incomplete or not valid.\n' +
        'List of required properties:\n' +
        `*title: needs to be String, received ${prod.title}\n` +
        `*description: needs to be String, received ${prod.description}\n` +
        `*price: needs to be Number, received ${prod.price}\n` +
        `*thumbnail: needs to be Array, received ${prod.thumbnail}\n` +
        `*code: needs to be String, received ${prod.code}\n` +
        `*stock: needs to be Number, received ${prod.stock}\n` +
        `*status: needs to be a Boolean, received ${prod.status}\n` +
        `*category: needs to be String, received ${prod.category}\n`
    );
};
