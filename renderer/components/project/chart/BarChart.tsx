import {BarDatum, ResponsiveBar, ResponsiveBarCanvas} from '@nivo/bar';

type PropBarChart = {
  key: string[];
  data: BarDatum[];
};
type Props = {
  chartObj: PropBarChart;
};

const BarChart = ({chartObj}: Props) => {
   console.log(chartObj);
  return (
    <ResponsiveBar
      data={chartObj.data}
      keys={chartObj.key}
      indexBy="indexName"
      margin={{top: 0, right: 0, bottom: 40, left: 60}}
      padding={0.3}
      layout="horizontal"
      valueScale={{type: 'linear'}}
      indexScale={{type: 'band', round: true}}
      colors={{scheme: 'nivo'}}
       defs={[
         {
           id: 'dots',
           type: 'patternDots',
           background: 'inherit',
           color: '#38bcb2',
           size: 4,
           padding: 1,
           stagger: true,
         },
         {
           id: 'lines',
           type: 'patternLines',
           background: 'inherit',
           color: '#eed312',
           rotation: -45,
           lineWidth: 6,
           spacing: 10,
         },
       ]}
       fill={[
         {
           match: {
             id: 'fries',
           },
           id: 'dots',
         },
         {
           match: {
             id: 'sandwich',
           },
           id: 'lines',
         },
       ]}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'files',
        legendPosition: 'middle',
        legendOffset: -50,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      legends={[]}
       role="application"
       ariaLabel="Nivo bar chart demo"
       barAriaLabel={function (e) {
         return e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue;
       }}
    />
  );
};

export default BarChart;
