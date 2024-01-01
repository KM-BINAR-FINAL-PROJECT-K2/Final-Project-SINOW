/* eslint-disable react/prop-types */
export default function Breadcrumb({ links }) {
  return (
    <nav className="flex py-3 text-gray-700" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {links.map((link, index) => (
          <div key={index}>
            {index === 0 && (
              <li className="inline-flex items-center">
                <a
                  href={link.url ? link.url : "#"}
                  className={`inline-flex items-center text-sm font-medium  hover:text-blue-600 ${
                    links.length === 1
                      ? "text-darkblue-05 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {link.name}
                </a>
              </li>
            )}
            {index > 0 && (
              <li>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <a
                    href={link.url ? link.url : "#"}
                    className={`ms-1 text-sm  hover:text-blue-600 md:ms-2  ${
                      links.length - 1 === index
                        ? "text-darkblue-05 font-semibold"
                        : "text-gray-600 font-medium"
                    }`}
                  >
                    {link.name}
                  </a>
                </div>
              </li>
            )}
          </div>
        ))}
      </ol>
    </nav>
  );
}
