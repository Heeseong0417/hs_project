import {useEffect, useState} from 'react';

type Prop = {
  dates: string;
};

export const stringDate = ({dates}: Prop) => {
  const locale = 'en';
  const today = new Date(dates);

  // const day = today.toLocaleDateString(locale, { weekday: "short" });
  const year = `${today.toLocaleDateString(locale, {
    year: 'numeric',
  })}`;
  const date = `${today.toLocaleDateString(locale, {
    month: 'numeric',
  })}/${today.getDate()}`;

  const time = today.toLocaleTimeString(locale, {
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    second: 'numeric',
  });

  return `${year}/${date} ${time}`;
};
