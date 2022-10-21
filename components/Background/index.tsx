export default function Background() {
    return (
        <div className="fixed top-0 h-screen w-screen z-0">
            <video
                className="object-cover h-full w-full opacity-20"
                src="/assets/videos/background.mp4"
                autoPlay
                loop
                muted />
        </div>
    )
}