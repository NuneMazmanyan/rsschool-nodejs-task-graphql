import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import {UUIDType} from './uuid.js';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: new GraphQLNonNull(UUIDType),
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        balance: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
    },
});

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: {
        id: {
            type: new GraphQLNonNull(UUIDType),
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
        },
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
        authorId: {
            type: new GraphQLNonNull(UUIDType),
        },
    },
});

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        id: {
            type: new GraphQLNonNull(UUIDType),
        },
        isMale: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
        yearOfBirth: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        userId: {
            type: new GraphQLNonNull(UUIDType),
        },
        memberTypeId: {
            type: new GraphQLNonNull(UUIDType),
        },
    },
});

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: {
        id: {
            type: new GraphQLNonNull(new GraphQLEnumType({
                name: 'MemberTypeId',
                values: {
                    BASIC: { value: 'basic' },
                    BUSINESS: { value: 'business' },
                }
            })),
        },
        discount: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        postsLimitPerMonth: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
});