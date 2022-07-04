import express from 'express'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { createApolloServer } from './apollo-server'

dotenv.config()

async function main(){

    const app = express()
    const httpServer = createServer(app)
    
    const apolloServer = await createApolloServer(httpServer, app)
    
    app.get('/', function(req,res) {
        res.status(200).json({
            data: "REST API is working"
        })
    })
    
    const PORT = process.env.PORT || 5000

    await new Promise<void>(function(resolve) {
        app.listen(PORT, function() {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
            console.log(`🚀 GQL Server is running at http://localhost:${PORT}${apolloServer.graphqlPath}`);
        })
        resolve()
    })
    
}

main().catch(function(err) {
    console.error(err);
})
