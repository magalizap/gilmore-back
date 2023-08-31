import { expect } from "chai";
import supertest from "supertest";
import config from '../../src/config/envConfig.js'
import { dropCart } from "../setup.test.js";
import { authenticateUser } from '../utils/testAuth.test.js'

const PORT = config.port
const requester = supertest(`http://localhost:${PORT}`)

describe('Test routes Cart', () => {
    before(async () => {
        await dropCart()
    })

    it('[POST] /api/cart/ create initially cart', async () => {

        const cart = [{
            products: []
        }]

       
        const response = await requester.post('/api/cart').send(cart)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body).to.be.ok
    })

    it('[GET] /api/cart/:cid find cart by id', async () => {
        const cid = '64efeb5367a80c6f812477c8'

        const response = await requester.get(`/api/cart/${cid}`)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body).to.be.ok
    })

    it('[DELETE] /api/cart/:cid delete cart', async () => {
        const cid = '64efeb5367a80c6f812477c8'
        const response = await requester.get(`/api/cart/${cid}`)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body).to.be.ok
    })

})
