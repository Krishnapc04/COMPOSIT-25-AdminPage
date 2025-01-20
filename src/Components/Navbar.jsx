import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      
        <nav className="bg-gray-200 dark:bg-gray-700">
            <div className="max-w-screen-xl px-4 py-3 mx-auto">
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                        <li>
                            <Link to={"/allusers"} className="text-gray-900 dark:text-white hover:underline">AllUsers</Link>
                        </li>
                        <li>
                            <Link to={"/allevents"} className="text-gray-900 dark:text-white hover:underline">Events</Link>
                        </li>
                        <li>
                            <Link to={"/allSa"} className="text-gray-900 dark:text-white hover:underline">Student Ambassador`s</Link>
                        </li>
                        <li>
                            <Link to={"/Halls"} className="text-gray-900 dark:text-white hover:underline">Alloted Hall`s</Link>
                        </li>
                        {/* <li>
                            <Link to={"/home"} className="text-gray-900 dark:text-white hover:underline">Features</Link>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>

    </div>
  )
}

export default Navbar
