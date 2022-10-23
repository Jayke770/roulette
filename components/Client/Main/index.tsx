export default function Main({ children }) {
    return (
        <main className="overflow-auto h-screen translucent">
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col">
                {children}
            </div>
        </main>
    )
}