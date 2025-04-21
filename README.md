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
