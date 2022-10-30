export default function ChatSent({ username, message }: { username?: string, message: string }) {
    return (
        <div id='sent' className='flex w-full justify-end'>
            <div className='flex flex-col dark:bg-zinc-800 p-1 rounded-b-lg rounded-tl-lg max-w-[75%]'>
                <div className='p-2 text-sm font-extralight '>
                    {message}
                </div>
            </div>
        </div>
    )
}