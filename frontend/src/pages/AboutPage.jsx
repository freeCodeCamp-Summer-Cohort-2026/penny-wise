function AboutPage() {
    return (
        <>
        {/* NavBar would go here */}
        <main>
                <h1>About Us</h1>
                <section>
                    <p>The pennies behind the wisdom.</p>
                    <div className="flex flex-col sm:flex-row justify-around content-center gap-3 my-8">
                        <div className="border flex-initial basis-md h-24 rounded-md hover:shadow-xl duration-100">
                            <h2>1</h2>
                            <p className="text-xl">Lorem</p>
                        </div>
                        <div className="border flex-initial basis-md h-24 rounded-md hover:shadow-xl duration-100">
                            <h2>2</h2>
                            <p className="text-xl">Ipsum</p>
                        </div>
                        <div className="border flex-initial basis-md h-24 rounded-md hover:shadow-xl duration-100">
                            <h2>3</h2>
                            <p className="text-xl">Dolor</p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}


export default AboutPage
