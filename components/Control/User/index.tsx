import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
type Participant = {
    userid: string,
    image: string,
    socket: Socket
}
interface UserData {
    info: {
        id: string,
        first_name?: string,
        last_name?: string,
        username: string,
        image?: string
    },
    socketID: string,
}
export default function ControlUserCard(props: Participant) {
    const [user, setUser] = useState<UserData>()
    useEffect(() => {
        props.socket.emit('user-info', { id: props.userid }, (res: UserData) => setUser(res))
        return () => {
            props.socket.off('user-info')
        }
    }, [])
    return (
        <div className="bg-zinc-800 flex justify-between gap-2 px-3.5 py-3 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-[.97] dark:hover:bg-green-primary/50">
            <div className="flex gap-2.5">
                <img
                    alt={'user'}
                    src={props.image}
                    className="w-14 h-14 object-cover rounded-full" />
                <div className="flex flex-col justify-center">
                    {user ? (
                        <span className="dark:text-zinc-200 font-medium">@{user.info.username}</span>
                    ) : (
                        <span className="animate-blink h-4 w-full rounded" />
                    )}
                    <span className="dark:text-zinc-400 text-xs font-normal">{props.userid}</span>
                </div>
            </div>
            <div className="flex justify-end items-center">
                {user?.socketID ? (
                    <div className="text-sm font-normal bg-teal-900/50 px-2 py-1 rounded-full text-teal-500">Online</div>
                ) : (
                    <div className="text-sm font-normal bg-amber-900/50 px-2 py-1 rounded-full text-amber-500">Offline</div>
                )}
            </div>
        </div>
    )
}