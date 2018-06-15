'use strict';

const connectToDatabase = require('./db');
const Planet = require('./models/Planet');
const swapi = require('swapi-node');
const Promise = require('bluebird');
require('dotenv').config({ path: './variables.env' });

/*=========================================================================
| POST - Create a new planet and find its related movies to attach to it. |
=========================================================================*/
module.exports.create = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            //Get planet's name
            getPlanetMovies(JSON.parse(event.body).name)
                .then((planetMovies) => {
                    //console.log('event body', event.body);
                    var newPlanet = JSON.parse(event.body);
                    //Add found movies to the planet
                    newPlanet.films = planetMovies;
                    //Persist the planet
                    Planet.create(newPlanet)
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
        });
};

/*===================================
| GET - Find a planet by id or name |
===================================*/
module.exports.getOne = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.findOne({
                    $or: [{
                            _id: event.pathParameters.id
                        },
                        {
                            name: event.pathParameters.name
                        }
                    ]
                })
                .then(planet => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(planet, null, 4)
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

/*=======================
| GET - Get all planets |
=======================*/
module.exports.getAll = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.find()
                .then(planets => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(planets, null, 4)
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

/*=======================
| Update a planet by ID |
=======================*/
module.exports.update = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), {
                    new: true
                })
                .then(planet => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(planet, null, 4)
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

/*=======================
| Delete a planet by ID |
=======================*/
module.exports.delete = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Planet.findByIdAndRemove(event.pathParameters.id)
                .then(planet => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Removed planet with id: ' + planet.id,
                        planet: planet
                    }, null, 4)
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


// Fetch SWAPI looking for a planet with the given name and find its related movies
function getPlanetMovies(planetName) {
    var urls = [];

    for (var i = 1; i < 10; i++) {
        urls.push('http://swapi.co/api/planets/?page=' + i);
    }

    var planets = [];

    return Promise.map(urls, getPlanetsByURL).then((result) => {
        result.forEach(element => {
            if (element && element.results) {
                element.results.forEach(planet => {
                    console.log(planet);
                    if (planet.name == planetName) {

                        planets.push(planet.films);
                    }
                });
            }
        });
    }).then(() => {
        return Promise.resolve(planets);
    });
}

// Given a url, returns a promise with a JSON object
function getPlanetsByURL(url) {
    return swapi.get(url).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}