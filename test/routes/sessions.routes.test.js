import config from '../../src/config/env.config.js'
import { expect } from "chai";
import supertest from "supertest";
import { dropUser } from "../setup.test.js";
import { authenticateUser } from '../auth/testAuth.test.js';



const PORT = config.port
const requester = supertest(`https://matesuli-back.onrender.com:${PORT}`)


describe('Test routes sessions', () => {

    before (async ()=>{
        await dropUser()
    })

    it('[POST] /api/sessions/signup  signup successfully', async () => {

        const mockUser = {
            
            first_name: 'Usuario',
            last_name: 'Test',
            age: 20,
            email: 'user@test.com',
            password: '123456',
            role: 'User'
            
        }

        const response = await requester.post('/api/sessions/signup').send(mockUser)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.be.ok
    })

    it('[POST] /api/sessions/signup  signup successfully', async () => {

        const mockUserAdmin = {
            
            first_name: 'Usuario',
            last_name: 'Test',
            age: 20,
            email: 'admin@test.com',
            password: '123456',
            role: 'Admin'
            
        }

        const response = await requester.post('/api/sessions/signup').send(mockUserAdmin)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.be.ok
    })

    it('[POST] /api/sessions/signup  signup successfully', async () => {

        const mockUserPremium = {
            
            first_name: 'Usuario',
            last_name: 'Test',
            age: 20,
            email: 'premium@test.com',
            password: '123456',
            role: 'Premium'
            
        }

        const response = await requester.post('/api/sessions/signup').send(mockUserPremium)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.be.ok
    })




    it('[POST] /api/sessions/login login successfully', async () => {
        const mockUser = {
            email: 'admin@test.com',
            password: '123456',
        };
        const response = await requester.post('/api/sessions/login').send(mockUser)

        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.be.ok
    })

    it('[POST] /api/sessions/login failureRedirect 302', async() => {

        const mockUser = {
            email: 'email@invalid.com',
            password: '1234',
        }
        const response = await requester.post('/api/sessions/login').send(mockUser)
        
        expect(response.statusCode).to.be.eql(302)
        expect(response.body.payload).not.to.be.ok
    })

    it('[GET] /api/sessions/current session profile', async () => {
        const agent = await authenticateUser('Admin')
        const response = await agent.get('/api/sessions/current')

        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.be.ok

        const user = response.body.payload
        //console.log(user)
        expect(user.email).to.be.eql('admin@test.com')
    })
})




