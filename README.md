# APP ROUTE
```js
//user
app.use('/user', require('./routes/userRoutes'));

//login
app.use('/log',require('./routes/logroutes'));
```
# Message 

send the `message`

```js
app.post('/message/:userId',require('/message/messagecontroler'));
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
```

```

