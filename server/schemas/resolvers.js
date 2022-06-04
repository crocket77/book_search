const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const{signToken}=require('../utils/auth')

const resolvers = {
    Query: {
      me: async (parent, args,context) => {
        if(context.user){
        const userData = await User.findOne({})
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');
    
        return userData;
        }
        throw new AuthenticationError('Not logged in')
      },
      books: async (parent,{title}) => {
        const params = title ? { title } : {};
        return Book.find(params).sort({ createdAt: -1 });
        },
        users: async () => {
          return User.find()
            .select('-__v -password')
            .populate('savedBooks')
           
            // .populate('interests');
        },
      },
      
      Mutation:{
        addUser: async(parent,args)=>{
          const user = await User.create(args);
          const token = signToken(user);
          return { token, user };
        },
        login:async(parent,{email,password})=>{
          const user = await User.findOne({email});
  
          if (!user){
            throw new AuthenticationError('Incorrect credentials');
          }
  
          const correctPw = await user.isCorrectPassword(password);
  
          if(!correctPw){
            throw new AuthenticationError('Incorrect credentials')
          }
  
          const token = signToken(user);
          return { token, user };
                  
        },
        saveBook: async (parent,{book},context)=>{
          if(context.user){
            const userNew=await User.findOneAndUpdate(
              {_id:context.user._id},
              {$addToSet: {savedBooks:book}},
              {new:true}
              )
              return userNew;
            }
              throw new AuthenticationError('You need to log in');
        },
       
        deleteBook: async(parent,args,context)=>{
          console.log(context.user._id)
          if (context.user){
            const userNew = await User.findOneAndUpdate(
              {_id: context.user._id},
              {$pull:{savedBooks:{bookId:args.bookId}}},
              {new:true}
            );
            return updatedUser;
          }
        }
      }
  };
  
  module.exports = resolvers;