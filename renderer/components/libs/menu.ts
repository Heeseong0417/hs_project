import {
  BookOpenIcon,
  HomeIcon,
  SearchCircleIcon,
  TemplateIcon,
} from '@heroicons/react/outline';

export const navigation = [
  {name: 'Home', href: '/', icon: HomeIcon, current: false},
  {name: 'JSON 변환', href: '/schema', icon: TemplateIcon, current: false},
  {name: 'PROJECT 관리', href: '/schema/index_ex', icon: BookOpenIcon, current: false},
];
