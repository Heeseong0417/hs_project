import Link from 'next/link';
import React from 'react';

import Image from 'next/image';
type Props = {
  navigation: any[];
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MainAside = ({navigation}: Props) => (
  <div className="flex flex-col w-64 fixed inset-y-0 border-r border-gray-200 pt-5 pb-4 bg-gray-100">
    <div className="flex items-center flex-shrink-0 px-6">
      <img src='http://www.coever.co.kr/Image/l4.png' alt='없음' width={150} height={90}></img>
      {/*<h1 className="font-bold text-2xl tracking-tight font-mono subpixel-antialiased">
        PASSBUCKET
</h1>*/}
    </div>
    {/* Sidebar component, swap this element with another sidebar if you like */}
    <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
      {/* Navigation */}
      <nav className="px-3 mt-6">
        <div className="space-y-1">
          {navigation.map(item => (
            <Link href={item.href} key={item.name}>
              <a
                className={classNames(
                  item.current
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6',
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  </div>
);

export default MainAside;
