import NavBar from "../components/NavBar"

function LessonPage() {

    return (
        <>
            <NavBar/>
            <main>
                <h1>Lesson Title</h1>
                <section>
                    <h2>Goal at a Glance</h2>
                    <p>After completing this lesson, I can...</p>
                </section>
                <section className="my-10">
                    <h2>Key Concepts</h2>
                    <ul className="mx-8 grid grid-cols-2 grid-rows-2 gap-4 justify-center">
                        <li className="border rounded-md w-md h-30 hover:shadow-xl duration-100">Concept 1</li>
                        <li className="border rounded-md h-30 w-md hover:shadow-xl duration-100">Concept 2</li>
                        <li className="border rounded-md h-30 w-md hover:shadow-xl duration-100">Concept 3</li>
                        <li className="border rounded-md h-30 w-md hover:shadow-xl duration-100">Concept ...</li>
                    </ul>
                </section>
                <section className="my-10">
                    <h2>Practice</h2>
                    <p>Time to start a...</p>
                    <div className="flex flex-col sm:flex-row justify-evenly gap-3 p-4">
                        <button className="border rounded-md h-10 w-20 hover:shadow-xl duration-100 cursor-pointer">Tutorial</button>
                        <button className="border rounded-md h-10 w-20 hover:shadow-xl duration-100 cursor-pointer">Lab</button>
                    </div>
                </section>
            </main>
        </>
    )
}

export default LessonPage
