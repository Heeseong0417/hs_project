import React, { ReactNode, useState } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "PassBucket" }: Props) => {
  return (
    <div className="bg-gray-50 h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav className="py-4 w-full bg-gray-50 dark:bg-gray-900 ">
          <div className="max-w-7xl px-4 md:px-12 mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex justify-between">
              <a aria-current="page" className="flex" href="/">
                <span className="text-blue-900 dark:text-white self-center text-xl font-bold whitespace-nowrap">
                  PassBucket
                </span>
              </a>
            </div>
            <ul
              className={`flex flex-col md:flex-row md:self-center pt-6 pb-3 md:py-0 collapse`}
            >
              {/* <li className="md:px-6 mb-3 md:mb-0">
                <Link href="/validation">
                  <a className="font-medium text-gray-900 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500">
                    Validation
                  </a>
                </Link>
              </li> */}
              <li className="md:px-6 mb-3 md:mb-0">
                <Link href="/">
                  <a className="font-medium text-gray-900 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500">
                    Test
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <div className="h-full">{children}</div>
    </div>
  );
};

export default Layout;
