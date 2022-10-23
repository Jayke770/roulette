type Participant = {
    userid: string,
    image: string,
    created: string
}
export default function _Participant(props: Participant) {
    return (
        <div className="bg-zinc-800 flex justify-between gap-2 px-3.5 py-3 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-[.97] dark:hover:bg-green-primary/50">
            <div className="flex gap-2">
                <img
                    alt={props.userid}
                    src={props.image}
                    className="w-14 h-14 object-cover rounded-full" />
                <div className="flex flex-col items-center justify-center">
                    <span>{props.userid}</span>
                </div>
            </div>
            <div className="flex justify-end items-center">
                <div className="text-sm font-normal bg-teal-900/50 px-2 py-1 rounded-full text-teal-500">Online</div>
            </div>
        </div>
    )
}