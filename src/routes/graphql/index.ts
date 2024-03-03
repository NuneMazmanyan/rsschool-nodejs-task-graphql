import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGQLRequestSchema, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';

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
        async handler(req) {
            const { query, variables } = req.body;
            return await graphql({
                schema: createGQLRequestSchema,
                source: query,
                contextValue: { prisma },
                variableValues: variables,
            });
        },
    });
};

export default plugin;