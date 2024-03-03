import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLBoolean } from 'graphql';
import { UserType, PostType, ProfileType, MemberType } from '../types/types.js';
import { DB } from '../types/db-type.js';
import { UUIDType } from '../types/uuid.js';

export const rootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve: async (_, __, { prisma }: { prisma: DB }) => {
                return await prisma.user.findMany();
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (_, __, { prisma }: { prisma: DB }) => {
                return await prisma.post.findMany();
            },
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async (_, __, { prisma }: { prisma: DB }) => {
                return await prisma.profile.findMany();
            },
        },
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_, __, { prisma }: { prisma: DB }) => {
                return await prisma.memberType.findMany();
            },
        },
        user: {
            type: UserType,
            args: {
                userId: {
                    type: new GraphQLNonNull(UUIDType),
                },
            },
            resolve: async (_, { userId } : { userId: string }, { prisma }: { prisma: DB }) => {
                console.log('RESOLVER:', userId);
                return await prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
            },
        },
    }),
});


export const rootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: GraphQLBoolean,
            resolve: async () => {
                return true;
            },
        },
    },
});
