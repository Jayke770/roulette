export default function Main({ children }) {
    return (
        <main className="w-full h-full">
            <div className="mx-auto max-w-7xl py-2 md:py-5 sm:px-6 lg:px-8 flex flex-col">
                {children}
            </div>
        </main>
    )
}