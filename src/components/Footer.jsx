const Footer = () => {
    return (
        <>
            <footer className="bg-blue-700 font-sans relative w-full">
                <div className="container px-6 py-4 mx-auto">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                        <div className="sm:col-span-2">
                            <h1 className="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl dark:text-white">Un gusto atenderle</h1>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200 md:my-8 dark:border-black h-2" />

                    <p className="font-sans p-8 text-start md:text-center md:text-lg md:p-2 text-white">
                        © 2025 You Company Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    )
}

export default Footer;