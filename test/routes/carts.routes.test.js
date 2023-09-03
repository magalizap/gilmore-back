import { expect } from "chai";
import supertest from "supertest";
import config from '../../src/config/envConfig.js'
import { dropCart } from "../setup.test.js";
import { authenticateUser } from '../auth/testAuth.test.js'

const PORT = config.port
const requester = supertest(`http://localhost:${PORT}`)

describe('Test routes Cart', () => {
    before(async () => {
        await dropCart()
    })

    const cart = [{
        products: []
    }]

    it('[POST] /api/cart/ create initially cart', async () => {
        const response = await requester.post('/api/cart').send(cart)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body).to.be.ok
    })

    it('[GET] /api/cart/:cid find cart by id', async () => {
        const responseCreate = await requester.post('/api/cart').send(cart)
        const array = responseCreate.body
        const obj = array[0]
        const cid = (obj._id)
        const response = await requester.get(`/api/cart/${cid}`)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body).to.be.ok
    })

    it('[DELETE] /api/cart/:cid   delete one cart', async () => {
        const responseCreate = await requester.post('/api/cart').send(cart)
        const array = responseCreate.body
        const obj = array[0]
        const cid = (obj._id)
        const response = await requester.delete(`/api/cart/${cid}`)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body).to.be.ok
    })

})
