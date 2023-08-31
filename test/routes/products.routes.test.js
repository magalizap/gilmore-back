import { expect } from "chai";
import supertest from "supertest";
import { dropProduct } from "../setup.test.js";
import config from '../../src/config/envConfig.js'
import { authenticateUser } from "../utils/testAuth.test.js";



const PORT = config.port
//const requester = supertest(`http://localhost:${PORT}`)

describe('Test routes Products', () => {
    before (async ()=>{
        await dropProduct()
    })

    it('[POST] /api/products creation successfully', async () => {
    
        const agent = await authenticateUser('Admin')

        const mockProduct = {
            title: 'Sandalia Camelia',
            description: 'Sandalia de ecocuero - base atideslizante',
            price: 10990,
            thumbnail: [],
            code: 'h3U7vDxg1Y09R2w2ubtc',
            stock: 16,
            status: true,
            category: 'calzado'
        }

        const response = await agent.post('/api/products').send(mockProduct)
        
        
        expect(response.statusCode).to.be.eql(200)
       
        expect(response.body.product.title).to.be.eql('Sandalia Camelia')
        expect(response.body.product.title)

    })


    it('[GET] /api/products find products successfully', async() => {
        const agent = await authenticateUser('Admin')
        const response = await agent.get('/api/products')
        expect(response.statusCode).to.be.eql(200)
        expect(response.text).to.be.ok
    })

    it('[PUT] /api/products/:pid update products successfully', async () => {
        const agent = await authenticateUser('Admin')

        const {pid} = '64eff1999c651b1bafed1444'

        const mockUpdateProduct = {
            title: 'Sandalia Camelia',
            description: 'Sandalia de ecocuero - base atideslizante',
            price: 10990,
            thumbnail: [],
            code: 'h3U7vDxg1Y09R2w2ubtc',
            stock: 5,
            status: true,
            category: 'calzado'
        };

        const response = await agent.put(`/api/products/${pid}`).send(mockUpdateProduct)
        //console.log(response.body)
        expect(response.statusCode).to.be.eql(200)
    })

})



  
