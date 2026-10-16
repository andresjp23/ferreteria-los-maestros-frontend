import { Link } from "react-router"


export default function Button({content}){
    return(
        <Link
            to="/productos"
            className="inline-flex items-center gap-2 self-start bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
            {content}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
            >
                <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
        </Link>
    )
}