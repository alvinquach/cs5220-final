'use strict';

require('dotenv').config();
const request = require('request');

const port = process.env.PORT || 3000;
const api = request.defaults({
    baseUrl: 'http://localhost:' + port + '/api',
    json: true
});

describe('Ticket API Tests:', () => {

    describe('Create Ticket Tests', () => {

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
                        'Authorization': `Bearer ${userToken}`
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
                        'Authorization': `Bearer ${userToken}`
                    },
                },
                (err, res, body) => {
                    expect(res.statusCode).not.toBe(200);
                    done();
                }
            );
        });
    });

    describe('Search Ticket Tests', () => {

        const term = 'equipment';

        let users;

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
                    api.get(
                        {
                            url: '/users',
                            headers: {
                                'Authorization': `Bearer ${body.token}`
                            }
                        },
                        (err, res, body) => {
                            users = body;
                            done();
                        }
                    );
                }
            );
        });

        it('Search for "equipment" in the tickets submitted to unit 1 as the user jsmith1. The results should contain two tickets.', (done) => {
            api.post(                {
                url: '/login',
                form: {
                    username: 'jsmith1',
                    password: 'abcd'
                }
            }, 
            (err, res, body) => {
                api.get({
                    url: '/tickets/search',
                    qs: {
                        term: term,
                        unitId: 1
                    },
                    headers: {
                        'Authorization': `Bearer ${body.token}`
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.length).toBe(2);
                    done();
                });
            });
        });

        it('Search for "equipment" in the tickets created by the user jojo as the user jojo. The results should contain three tickets.', (done) => {
            
            const requestor = 'jojo';

            api.post(                {
                url: '/login',
                form: {
                    username: requestor,
                    password: 'abcd'
                }
            }, 
            (err, res, body) => {
                api.get({
                    url: '/tickets/search',
                    qs: {
                        term: term,
                        userId: users.find(u => u.username == requestor)._id
                    },
                    headers: {
                        'Authorization': `Bearer ${body.token}`
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.length).toBe(3);
                    done();
                });
            });
        });

        it('Search for "equipment" in all tickets as the user techit. The results should contain three tickets.', (done) => {
            api.post(                {
                url: '/login',
                form: {
                    username: 'techit',
                    password: 'abcd'
                }
            }, 
            (err, res, body) => {
                api.get({
                    url: '/tickets/search',
                    qs: {
                        term: term
                    },
                    headers: {
                        'Authorization': `Bearer ${body.token}`
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.length).toBe(3);
                    done();
                });
            });
        });

        it('Search for "equipment" in all tickets as the user jsmith1. Should return 403.', (done) => {
            api.post(                {
                url: '/login',
                form: {
                    username: 'jsmith1',
                    password: 'abcd'
                }
            }, 
            (err, res, body) => {
                api.get({
                    url: '/tickets/search',
                    qs: {
                        term: term
                    },
                    headers: {
                        'Authorization': `Bearer ${body.token}`
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            });
        });

    });

});