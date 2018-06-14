'use strict';

const connectToDatabase = require('./db');
const Planet = require('./models/Planet');
const swapi = require('swapi-node');
require('dotenv').config({ path: './variables.env' });

module.exports.create = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.create(JSON.parse(event.body))
                .then(planet => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(planet)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'Could not create the planet.'
                }));
        });
};

module.exports.getOne = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.findById(event.pathParameters.id)
                .then(planet => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(planet)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'Could not fetch the planet.'
                }));
        });
};

module.exports.getAll = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    /*swapi.get('http://swapi.co/api/planets/?search=tatooine').then((result) => {
        console.log(result);
        return result.nextPage();
    }).then((result) => {
        console.log(result);
        return result.previousPage();
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });*/

    for (var i = 1; i < 10; i++) {
        swapi.get('http://swapi.co/api/planets/?page=' + i).then((result) => {
            console.log(result['results']);
        }).catch((err) => {
            console.log(err);
        });
    }

    connectToDatabase()
        .then(() => {
            Planet.find()
                .then(planets => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(planets)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'Could not fetch the planets.'
                }))
        });
};

module.exports.update = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), {
                    new: true
                })
                .then(planet => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(planet)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'Could not fetch the planets.'
                }));
        });
};

module.exports.delete = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.findByIdAndRemove(event.pathParameters.id)
                .then(planet => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Removed planet with id: ' + planet._id,
                        planet: planet
                    })
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'Could not fetch the planets.'
                }));
        });
};