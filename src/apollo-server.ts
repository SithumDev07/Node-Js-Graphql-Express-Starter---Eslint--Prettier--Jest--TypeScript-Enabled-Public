import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { addResolversToSchema } from '@graphql-tools/schema'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { ApolloServer, ExpressContext } from 'apollo-server-express'
import express from 'express'
import { Server } from 'http'
import { join } from 'path'

const SCHEMA = loadSchemaSync(join(__dirname, '../schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
})

export async function createApolloServer(
    httpServer: Server,
    app: express.Application
): Promise<ApolloServer<ExpressContext>> {
    const server = new ApolloServer({
        schema: addResolversToSchema({
            schema: SCHEMA,
            resolvers: {
                Query: {
                    currentUser(){
                        return {
                            id: "12345",
                            name: "Sithum Basnayake",
                        }
                    }
                }
            }
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    })

    await server.start()

    server.applyMiddleware({ app })

    return server
}