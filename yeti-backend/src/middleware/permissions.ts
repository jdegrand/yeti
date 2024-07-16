import { allow, deny, or, rule, shield } from 'graphql-shield'
import { AuthenticationError, ForbiddenError } from '../types/YetiError';
import { GraphQLContext } from 'src/types/GraphQLContext';

const isAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    const isAdmin = !!(ctx as GraphQLContext).user?.isAdmin;
    return isAdmin || new ForbiddenError('Unauthorized: not an admin');
})

const isUser = rule({ cache: 'strict' })(async (parent, args, ctx, info) => {
    return (ctx as GraphQLContext).user?.userId === parent.id || new ForbiddenError('Unauthorized: user does not have access to the information requested');
})
   

const isLoggedIn = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    const hasId = !!(ctx as GraphQLContext).user?.userId;
    return hasId || new AuthenticationError('Unauthorized: invalid token');
})

const userPermissions = {
    Query: {
      login: allow,
      getUser: isLoggedIn,
      getUsers: isAdmin,
    },
    Mutation: {
      register: allow,
      deleteUser: isAdmin,
    },
}

const taskPermissions = {
    Query: {
        getTask: isLoggedIn,
        getTasks: isLoggedIn,
    },
    Mutation: {
        createTask: isLoggedIn,
    },
}

export const permissions = shield(
    {
        Query: {
            ...userPermissions.Query,
            ...taskPermissions.Query,
        },
        Mutation: {
            ...userPermissions.Mutation,
            ...taskPermissions.Mutation,
        },
        User: {
            id: allow,
            username: allow,
            firstName: allow,
            email: or(isUser, isAdmin),
            lastName: or(isUser, isAdmin),
            createdAt: allow,
            updatedAt: allow,
            isAdmin: allow,
        }
    },
    {
        fallbackRule: deny,
        allowExternalErrors: true,
        fallbackError: new AuthenticationError('Unauthorized: action not permitted'),
    }
);
   
