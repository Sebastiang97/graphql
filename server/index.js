import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { v1 as uuid } from 'uuid';
import mongoose from 'mongoose'

//contraseña = 'T0c5RTF8KLfiKv56'


// const connection = async function () {
//     const conn = await mongoose.connect(``)
//     console.log("Mongo DB connected:", conn.connection.host)
// }
const connection = async function () {
    const conn = await mongoose.connect('mongodb://localhost:27017/testingGraph', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("Mongo DB connected:", conn.connection.host)
}

connection()



const persons = [
    {
        name: "Midu",
        phone: "034-1234567",
        street: "Calle Frontend",
        city: "Barcelona",
        id: "3d594650-3436-11e9-bc57-8b80ba54c431"
    },
    {
        name: "Youseff",
        phone: "044-123456",
        street: "Avenida Fullstack",
        city: "Mataro",
        id: '3d599470-3436-11e9-bc57-8b80ba54c431'
    },
    {
        name: "Itzi",
        street: "Pasaje Testing",
        city: "Ibiza",
        id: '3d599471-3436-11e9-bc57-8b80ba54c431'
    },
]

const typeDefs = `#graphql
    enum YesNo{
        YES
        NO
    }
    
    type Person {
        name: String!
        phone: String
        street: String!
        city: String!
        id: ID!
        infoAll: String
        address: Address
    }

    type Address {
        street: String!
        city: String!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        allPersonsWithPhone(phone: YesNo): [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
        editNumber(
            name: String!
            phone:String!
        ): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () =>  db.Book.find() ,
        allPersonsWithPhone: (root, args) => {
            if (!args.phone) return persons
            return persons.filter(p => args.phone === "YES" ? p.phone : !p.phone)
        },
        findPerson: (root, args) => persons.find(person => person.name === args.name)
    },

    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(p => p.name === args.name)) {
                throw new Error('Name must be Unique ')
            }
            const person = { ...args, id: uuid() }
            persons.push(person)
            return person
        },
        editNumber: (root, args) => {
            const personIndex = persons.findIndex(p => p.name === args.name)
            let per = null
            persons.map(p => {
                if (p.name === args.name) {
                    p.phone = args.phone
                    per = p
                }
            })
            return per
            // if (personIndex === -1) return null

            // const person = persons[personIndex]
            // const updatedPerson = { ...person, phone: args.phone }
            // persons[personIndex] = updatedPerson
            // return updatedPerson
        }
    },

    Person: {
        infoAll: (root) => `${root.street}, ${root.city}, ${root.phone}`,
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
        if (
            formattedError.extensions.code ===
            ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
        ) {
            return {
                ...formattedError,
                message: "Your query doesn't match the schema. Try double-checking it!",
            };
        }
        return formattedError;
    },
})

//server.listen().then(({ url }) => console.log(`Server ready at ${url}`))

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);