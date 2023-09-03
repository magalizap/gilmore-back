import swaggerJsdoc from  'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const swaggerOptions = {
    definition: {
        openapi:'3.0.1',
        info: {
            title: 'Documentación de las APIs',
            description: 'Detalle del la estructura del ecommerce',
            version: '1.0.0',
            contact: {
                name: 'Magali Sol Zapata',
                url: 'https://www.linkedin.com/in/magal%C3%AD-sol-zapata-444b88234/'
            }
        }
    },
    apis: [`${process.cwd()}/src/docs/**/*.yaml`],
}

const spec = swaggerJsdoc(swaggerOptions)
export const swaggerServe = swaggerUiExpress.serve
export const swaggerSetup = swaggerUiExpress.setup(spec)
