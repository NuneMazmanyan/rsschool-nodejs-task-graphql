import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphqlSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import Loader from './queries/loader.js';
import { Context } from './types/types.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const { prisma } = fastify;

    fastify.route({
        url: '/',
        method: 'POST',
        schema: {
            ...createGqlResponseSchema,
            response: {
                200: gqlResponseSchema,
            },
        },
        async handler(req,res) {
            const { query, variables } = req.body;

            const validationErrors = validate(graphqlSchema, parse(query), [depthLimit(5)]);

            if (validationErrors.length) {
                return res.send({ errors: validationErrors });
            }

            return await graphql({
                schema: graphqlSchema,
                source: query,
                contextValue: {
                    db: prisma,
                    loader: new Loader(prisma),
                } as Context,
                variableValues: variables,
            });
        },
    });
};

export default plugin;