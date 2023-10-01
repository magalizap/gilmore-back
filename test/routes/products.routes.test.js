import { expect } from "chai";
import supertest from "supertest";
import { dropProduct } from "../setup.test.js";
import config from '../../src/config/env.config.js'
import { authenticateUser } from "../auth/testAuth.test.js";



//const PORT = config.port
//const requester = supertest(`http://localhost:${PORT}`)

describe('Test routes Products', () => {
    before (async ()=>{
        await dropProduct()
    })

    const mockProduct = {
        title: 'Reposera Plegable Chilly Diseño Gris',
        description: 'Chilly - Tranca Style Living',
        price: 46400,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_916799-MLA48862305822_012022-O.webp',
        code: 'h3U7vDxg1Y09R2w2ubtc',
        stock: 16,
        status: true,
        category: 'Reposeras Plegables'
    }

    it('[POST] /api/products creation successfully', async () => {
    
        const agent = await authenticateUser('Admin')
        const response = await agent.post('/api/products').send(mockProduct)
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.product.title).to.be.eql('Reposera Plegable Chilly Diseño Gris')
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
        const responseCreate = await agent.post('/api/products').send(mockProduct)
        const newProductId = responseCreate.body.product._id;

        const mockUpdateProduct = {
            title: 'Reposera Plegable Chilly Diseño Gris',
            description: 'Chilly - Tranca Style Living',
            price: 46400,
            thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_916799-MLA48862305822_012022-O.webp',
            code: 'h3U7vDxg1Y09R2w2ubtc',
            stock: 9, // updated
            status: true,
            category: 'Reposeras Plegables'
        }

        const response = await agent.put(`/api/products/${newProductId}`).send(mockUpdateProduct)
        expect(response.statusCode).to.be.eql(200)
    })

})



  
