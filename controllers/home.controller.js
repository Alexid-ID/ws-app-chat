const GroupModel = require('../models/group.model');
const UserModel = require('../models/user.model');

class HomeController {
    async index(req, res) {
        const user = req.session.user || null;
        let groups, friends;
        let returnFriends = [];

        if(user) {
            console.log("user", user);
            groups = await GroupModel.find({ members: user._id }).select('_id name avatar members messages');
            groups = groups.filter(group => group.members.length > 2).map(group => {
                return {
                    _id: group._id,
                    name: group.name,
                    avatar: group.avatar,
                    messageId: group.messages,
                    members: group.members.length,
                }
            });

            friends = await GroupModel.find({ members: user._id }).select('_id name avatar members messages');

            for(let i = 0; i < friends.length; i++) {
                if(friends[i].members.length == 2) {
                    let friendId = friends[i].members.filter(member => member != user._id)[0];
                    let friend = await UserModel.findById(friendId);
                    returnFriends.push({
                        _id: friends[i]._id,
                        name: friend.name,
                        username: friend.username,
                        account_id: friend._id,
                        avatar: friend.avatar,
                        messageId: friends[i].messages,
                    });
                }
            }

            console.log("friends", returnFriends);
        }

        return res.render('home', { title: 'Home', user, groups, friends: returnFriends });
    }
}

module.exports = new HomeController();