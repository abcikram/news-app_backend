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
7. Get Top Headlines:

   - Endpoint: GET /api/news/top-headlines
   - Description: Retrieve the top headlines from various news sources.
   - Query Parameters:
   - country (optional): Filter articles based on the country of the news source.
   - **category (optional): Filter articles based on the category (e.g., business, sports, technology).Response: Returns a list of top headlines.**

---
## User API :-
---
1. Create user Schema .
2. Create user Api .
2. get user Api .
3. patch user Api . 

4. GET /api/user/preferences: Retrieve the user's current preferences and customization options.
5. PUT /api/user/preferences: Update the user's preferences and customization options.
6. POST /api/user/articles/save: Save an article to the user's saved articles list.
7. DELETE /api/user/articles/save/{articleId}: Remove a saved article from the user's savedarticles list.
8. POST /api/user/content/bookmark: Bookmark a piece of content.
9. DELETE /api/user/content/bookmark/{contentId}: Remove a bookmarked content item.
10. GET /api/user/recommendations: Get personalized recommendations based on the user's preferences.

https://lively-escape-193305.postman.co/workspace/New-Team-Workspace~ddb97bb9-5687-42d8-9e63-e18db34cdf37/collection/21786399-719d2ecb-28aa-4640-8a17-5db3cea29f21?action=share&creator=21786399

// POST /api/user/preferences
router.post('/api/user/preferences', async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have implemented user authentication and obtained the user ID from the request
    const { preferences } = req.body;

    // Update the user's preferences in the User schema
    const user = await User.findByIdAndUpdate(userId, { preferences }, { new: true });

    res.json(user.preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

// GET /api/news
router.get('/api/news', async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have implemented user authentication and obtained the user ID from the request

    // Retrieve the user's preferences from the database
    const user = await User.findById(userId).select('preferences');

    // Extract the preferred category names and types from the user's preferences
    const preferredCategories = user.preferences.map(preference => preference.category);
    const preferredTypes = user.preferences.map(preference => preference.type);

    // Fetch news articles based on the user's preferences
    const newsArticles = await Article.find({
      category: { $in: preferredCategories },
      type: { $in: preferredTypes }
    }).sort({ createdAt: -1 });

    res.json(newsArticles);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});














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



Username :-roy146571
Password :-Ska1FanAZAgUX18k

link :- mongodb+srv://roy146571:<password>@cluster0.xpt1akt.mongodb.net/