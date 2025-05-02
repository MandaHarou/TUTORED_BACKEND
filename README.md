# APP ROUTE
```js
//user
app.use('/user', require('./routes/userRoutes'));
```
```js
//login
app.use('/log',require('./routes/logroutes'));
```
```js
//message
app.use('/messages', require('./routes/messageRoutes'));
```
```js
//file
app.use('/files', fileRoutes);
```
# Message 

Get conversation `User`
```js
router.get('/conversations', messageController.getConversations);
//converssation specifique:
router.get('/conversation/:userId', messageController.getConversationMessages);
```

Get messages `User`
```js
router.get('/:userId', getMessages);
```

Send message `User`
```js
router.post('/', sendMessage);
```

Mark as read `User`
```js
router.patch('/:userId/read', markAsRead);
```

Delete message `User`
```js
router.delete('/:messageId', deleteMessage);
```
# AddUser 

add an `user`

```js
router.post('/useradd',setPost);
```
# FindUser 

find an user 

```js
router.get('/users',setGet); 
```
# Edit User 

Edit an `User`

```js
router.patch('/users/:id',updateUser);
```
# Edit allUser

Edit the `Users`
```js
router.put('/users/:id',setPut);
```

# Delet an User 

Delet an `User`
```js
router.delete('/users/:id',deletUser);
```
# LOGIN 

login and token
```js
router.post('/login', login);
```

logout 
```js
router.post('/logout', verifyToken, logout);
```




# The schemas BD

Schema `of user`

```json
{
    'name' : "sting",
    'role' : "string",
    'token' : "string",
    'isconected' : "boolean"
}
```
Schema `of message`

```json
{
    'titre' : "string",
    'id'    : "string"
}
```

Shema 
```js
{
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

