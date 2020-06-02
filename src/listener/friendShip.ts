import { Friendship } from 'wechaty';

export const onFriendShip = async (friendship: Friendship) => {
    console.log(friendship)
    const contact = friendship.contact();
    console.log(contact)
    console.log(`${contact.name()}----${contact.id}`)
    try {
        if (friendship.type() === Friendship.Type.Receive && friendship.hello() === 'wyc') {
            await friendship.accept()
        }
    } catch (error) {
        console.error(error)
    }
}