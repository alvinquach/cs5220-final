'use strict';

require('dotenv').config();
const request = require('request');

const port = process.env.PORT || 3000;
const api = request.defaults({
    baseUrl: 'http://localhost:' + port + '/api',
    json: true
});

describe('Ticket API Tests:', () => {

    let userToken = '';
  
    beforeAll((done) => {
        api.post(
            {
                url: '/login',
                form: {
                    username: 'techit',
                    password: 'abcd'
                }
            },
            (err, res, body) => {
                userToken = body.token;
                done();
            }
        );
    });

    it('Create ticket with no issues', (done) => {
        const newTicket = {
            createdForName: "Alvin Quach",
            createdForEmail: "asdf@asdf.com",
            subject: "Test create ticket",
            details: "This should work...",
            unit: 2
        };
        api.post(
            {
                url: '/tickets',
                body: newTicket,
                headers: {
                    'Authorization': 'Bearer ' + userToken
                },
            },
            (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body._id).not.toBeNull();
                expect(body.status).toBe('OPEN');
                expect(body.priority).toBe('MEDIUM');
                done();
            }
        );
    });

    it('Fail to create ticket due to missing fields', (done) => {
        api.post(
            {
                url: '/tickets',
                body: {},
                headers: {
                    'Authorization': 'Bearer ' + userToken
                },
            },
            (err, res, body) => {
                expect(res.statusCode).not.toBe(200);
                done();
            }
        );
    });

});