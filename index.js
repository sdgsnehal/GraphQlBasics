import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from '@apollo/server/standalone';
//db
import db from './_db.js'
//server setup
import {typeDefs} from './schema.js'
const resolvers ={
    Query:{
        games(){
            return db.games

        },
        game(_,args){
            return db.games.find((game)=>game.id=== args.id)
        
        
        },
        author(_,args){
            return db.authors.find((author)=>author.id=== args.id)
        },

        authors(){
            return db.authors
        
        },
        reviews(){
            return db.reviews
        },
        review(_,args){
            return db.reviews.find((review)=>review.id=== args.id)
        }

    },
    Game :{
        reviews(parent) {
            return db.reviews.filter((review)=>review.game_id=== parent.id)
        

        }
    },
    Author:{
        reviews(parent){
            return db.reviews.filter((review)=>review.author_id=== parent.id)

        }
    },
    Review:{
        author(parent){
            return db.authors.filter((a)=>a.id=== parent.author_id)

        },
        game(parent){
            return db.games.filter((g)=>g.id=== parent.game_id)

        }
    },
    Mutation:{
        deleteGame(_,args){
           db.games = db.games.filter((game)=>game.id!== args.id)
           return db.games
        },
        addGame(_,args){
            let game ={
                ...args.game,
                id:Math.floor(Math.random()*10000).toString()
            }
            db.games.push(game)
            return game

        },
        updateGame(_,args){
          db.games = db.games.map((g)=>{
            if(g.id === args.id){
                return {...g,...args.edits}
            }
            return g
          })
          
          return db.games.find((g)=>g.id ===args.id)
        }
        
    },

}

const server = new ApolloServer({
    //typeDefs, --different type of data we can query
    typeDefs,
    resolvers
    //resolvers -- how to handle the query



})
const {url} = await startStandaloneServer(server, {
    listen: { port: 4000 }
})
console.log(`Server ready at 4000`)

//client setup