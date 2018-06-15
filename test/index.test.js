const expect = require('chai').expect;
const nock = require('nock');

const getOne = require('../handler').getOne;
const response = require('./response');

describe('Get User tests', () => {
    beforeEach(() => {
        nock('https://skes7yea77.execute-api.us-east-1.amazonaws.com/dev/')
            .get('/planets/Alderaan')
            .reply(200, response);
    });

    it('Get a planet by name', () => {
        return getOne('Alderaan')
            .then(response => {
                //expect an object back
                expect(typeof response).to.equal('object');

                //Test result of name, company and location for the response
                expect(response.name).to.equal('Alderaan')
                expect(response.climate).to.equal('temperate')
                expect(response.terrain).to.equal('grasslands, mountains')
            });
    });
});