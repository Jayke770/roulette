export default function ChatReceived({ username, message }: { username: string, message: string }) {
    return (
        <div id='received' className='flex w-full justify-start'>
            <div className='flex flex-col dark:bg-gray-800 p-1 rounded-b-lg rounded-tr-lg max-w-[75%]'>
                <div className='px-2 py-1 text-sm font-extralight'>
                    {message}
                </div>
                <div className="px-2">
                    <span className="text-xs font-normal">{username}</span>
                </div>
            </div>
        </div>
    )
}