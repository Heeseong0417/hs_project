import {
  DownloadIcon,
  DuplicateIcon,
  FolderDownloadIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import React from "react";
{
  /* Top section */
}

const TestMainTop = () => (
  <div className="flex-shrink-0 border-b border-gray-200">
    {/* Toolbar*/}
    <div className="h-16 bg-white flex flex-col justify-center">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex justify-between">
          {/* Left buttons */}
          <div>
            <span className="relative z-0 inline-flex shadow-sm rounded-md sm:shadow-none sm:space-x-3">
              <span className="inline-flex sm:shadow-sm">
                <Link href="/test/new">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <PlusCircleIcon
                      className="mr-2.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>New</span>
                  </button>
                </Link>
                <button
                  type="button"
                  className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                >
                  <DuplicateIcon
                    className="mr-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Copy</span>
                </button>
                <button
                  type="button"
                  className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                >
                  <TrashIcon
                    className="mr-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Delete</span>
                </button>
              </span>

              <span className="inline-flex sm:shadow-sm space-x-3">
                <button
                  type="button"
                  className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                >
                  <DownloadIcon
                    className="mr-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Link href="/">
                    <span>Download</span>
                  </Link>
                </button>
                <button
                  type="button"
                  className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                >
                  <FolderDownloadIcon
                    className="mr-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Move</span>
                </button>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TestMainTop;
