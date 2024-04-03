import './App.css'

function App() {

    return (
        <>
            <div className="grid-rows-3 grid-cols-[[start-content]_2fr_[end-content_start-nav]_1fr_[end-nav]] grid">
                <div className="col-start-[start-content] col-end-[end-nav] h-[100px] bg-amber-900"></div>
                <div className="align-center justify-center flex col-start-1 col-end-2">
                    <h1 className="text-3xl font-bold underline">
                        Hello world!
                    </h1>
                </div>
                <div className="align-center justify-center flex col-start-2 col-end-2">
                    <h1 className="text-2xl font-bold">Nav</h1>
                </div>
                <div className="bg-amber-500 col-start-[start-content] col-end-[end-nav]"></div>
            </div>
        </>
    )
}

export default App
