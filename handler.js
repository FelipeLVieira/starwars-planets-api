'use strict';

const connectToDatabase = require('./db');
const Planet = require('./models/Planet');
const swapi = require('swapi-node');
const Promise = require('bluebird');

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

    getPlanetNames().then((results) => {
        console.log("Resultado de getPlanetNames: ", results);
    }).then(() => {
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

function getPlanetNames() {
    var urls = [];

    for (var i = 1; i < 10; i++) {
        urls.push('http://swapi.co/api/planets/?page=' + i);
    }

    var planets = [];

    return Promise.map(urls, getPlanets).then((result) => {
        result.forEach(element => {
            if (element && element.results) {
                element.results.forEach(planet => planets.push({ name: planet.name, filmes: planet.films }));
            };
        });
    }).then(() => {
        return Promise.resolve(planets);
    });
}

function getPlanets(url) {
    return swapi.get(url).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}