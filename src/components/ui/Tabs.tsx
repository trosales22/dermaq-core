import React from 'react';

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  uniqueName: string;
  defaultIndex?: number;
  withBorder?: boolean;
};

const Tabs: React.FC<TabsProps> = ({ tabs, uniqueName, defaultIndex = 1, withBorder = true }) => {
  return (
    <div className={`tabs tabs-lg ${withBorder ? 'tabs-border' : ''}`}>
      {tabs.map((tab, index) => (
        <React.Fragment key={index}>
          <input
            type="radio"
            name={uniqueName}
            className="tab"
            aria-label={tab.label}
            defaultChecked={index === defaultIndex}
          />
          <div className={`tab-content ${withBorder ? 'border-base-200' : ''} bg-base-100 p-5`}>
            {tab.content}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Tabs;
