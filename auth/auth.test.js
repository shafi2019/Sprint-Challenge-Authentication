const db = require('../database/dbConfig');
const request = require('supertest');
const server = require('../api/server');

// Resetting data with each call

beforeEach(async() => {
    await db('users').truncate()
})

// Test data

const testUser = {
    username: 'shafi',
    password: 'pass'
}

const testFail = {
    username: 'shafi2'
}

// Register tests...

describe('Functioning Register', () => {
    it('Should return status code 201', async() => {
        const response = await request(server)
        .post('/api/auth/register')
        .send(testUser)
        expect(response.status).toBe(201)
    }) 
    it('Should return status code 500', async() => {
        const response = await request(server)
        .post('/api/auth/register')
        .send(testFail)
        expect(response.status).toBe(500)
    })
})

// Login tests...

describe('Functioning Login', () => {
    it('Should return status code 401', async() => {
        const response = await request(server)
        .post('/api/auth/login')
        .send(testUser)
        // console.log(response)
        expect(response.status).toBe(401)
    })
    it('Should return an error object in JSON format', async() => {
        const response = await request(server)
        .post('/api/auth/login')
        .send(testUser)
        expect(response.type).toMatch(/json/i)
    })
})