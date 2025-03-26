import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Define interfaces for our data structures
interface MainTabItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

interface SubTabItem {
  id: string;
  label: string;
  href: string;
}

interface SettingsPageProps {
  mainTabs: MainTabItem[];
  subTabs: { [key: string]: SubTabItem[] };
}

const SettingsPage: React.FC<SettingsPageProps> = ({ mainTabs, subTabs }) => {
  // State to manage active main and sub tabs
  const [activeMainTab, setActiveMainTab] = useState(mainTabs[0].id);
  const [activeSubTab, setActiveSubTab] = useState(
    subTabs[activeMainTab] ? subTabs[activeMainTab][0].id : ''
  );

  // Handler for main tab change
  const handleMainTabChange = (tabId: string) => {
    setActiveMainTab(tabId);
    // Reset sub tab to first item when main tab changes
    setActiveSubTab(subTabs[tabId] ? subTabs[tabId][0].id : '');
  };

  // Handler for sub tab change
  const handleSubTabChange = (tabId: string) => {
    setActiveSubTab(tabId);
  };

  return (
    <div className="settings-container">
      {/* Main Tabs Navigation */}
      <ul className="nav nav-tabs nav-tabs-solid bg-transparent border-bottom mb-3">
        {mainTabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeMainTab === tab.id ? 'active' : ''}`}
              onClick={() => handleMainTabChange(tab.id)}
            >
              <i className={`${tab.icon} me-2`}></i>
              {tab.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="row">
        {/* Sidebar Sub Tabs */}
        <div className="col-xl-3 theiaStickySidebar">
          <Card>
            <CardContent>
              <div className="d-flex flex-column list-group settings-list">
                {subTabs[activeMainTab]?.map((subTab) => (
                  <a
                    key={subTab.id}
                    href="#"
                    className={`d-inline-flex align-items-center rounded ${
                      activeSubTab === subTab.id ? 'active' : ''
                    } py-2 px-3`}
                    onClick={() => handleSubTabChange(subTab.id)}
                  >
                    <i className="ti ti-arrow-badge-right me-2"></i>
                    {subTab.label}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="col-xl-9">
          <Card>
            <CardContent>
              {/* Render content based on active main and sub tabs */}
              {renderSettingsContent(activeMainTab, activeSubTab)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Dynamic content rendering function
const renderSettingsContent = (mainTabId: string, subTabId: string) => {
  // You would replace this with actual content rendering logic
  return (
    <div>
      <h4>
        Settings for {mainTabId} - {subTabId}
      </h4>
      {/* Add dynamic content rendering logic here */}
    </div>
  );
};

// Example usage
const App: React.FC = () => {
  // Define your main and sub tabs here
  const mainTabsData: MainTabItem[] = [
    {
      id: 'general',
      label: 'General Settings',
      icon: 'ti ti-settings',
      href: '#general',
    },
    {
      id: 'website',
      label: 'Website Settings',
      icon: 'ti ti-world-cog',
      href: '#website',
    },
    // Add more main tabs as needed
  ];

  const subTabsData: { [key: string]: SubTabItem[] } = {
    general: [
      { id: 'profile', label: 'Profile Settings', href: '#profile' },
      { id: 'security', label: 'Security Settings', href: '#security' },
      { id: 'notifications', label: 'Notifications', href: '#notifications' },
    ],
    website: [
      { id: 'design', label: 'Design Settings', href: '#design' },
      { id: 'seo', label: 'SEO Settings', href: '#seo' },
    ],
    // Add more sub tabs for each main tab
  };

  return (
    <SettingsPage 
      mainTabs={mainTabsData} 
      subTabs={subTabsData} 
    />
  );
};

export default App;