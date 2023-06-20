# test

## Admin API :-
---

1. first create admin schema .
2. Create Admin Api :-
     - Where admin wiil create 
3. Then Admin will Login .
     - create a middleware for admin, where admin can access and and do the operation .   

---

## News API :-
--- 
1. create News Schema .
2. create News api ( we are using admin middleware)
3. create get Api where only admin can access .
4. create get api for reader .
5. create get api for particular news (get/news/:id)
6. put api for updating the news **only admin can access**.
7. patch api for reader where he/she saved the news.

---
## User API :-
---
1. Create user Schema .
2. Create user Api .
2. get user Api .
3. patch user Api . 

##   
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assuming you have a database connection setup

const BookmarkedContent = sequelize.define('BookmarkedContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookmarkedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = BookmarkedContent;


const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assuming you have a database connection setup

const SavedArticles = sequelize.define('SavedArticles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  savedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = SavedArticles;


const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assuming you have a database connection setup

const UserPreferences = sequelize.define('UserPreferences', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categories: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interests: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserPreferences;

