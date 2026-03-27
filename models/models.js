const sequelize = require ('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique:true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING,defaultValue: "USER" }
})

const Todo = sequelize.define( 'todo',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    todo_status: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false}
})

User.hasMany(Todo, {
    foreignKey: 'userId',      
    onDelete: 'CASCADE'        
})
Todo.belongsTo(User, {
    foreignKey: 'userId'       
})

module.exports = { User, Todo }