// MainScreen.tsx
import React, { useState, useEffect } from 'react';

// --- Mock Icons ---
const MockIcon = ({ name, size = 20 }: { name: string; size?: number }) => (
  <div style={{
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px dashed var(--border-color, grey)`,
    borderRadius: '4px',
    marginRight: '5px',
    fontSize: '12px',
    color: 'currentColor'
  }}>
    {name.substring(0, 1)}
  </div>
);
const ArrowLeftIcon = () => <MockIcon name="ArrowLeft" />;
const SettingsIcon = () => <MockIcon name="Settings" />;
const PlusSquareIcon = () => <MockIcon name="NewChat" />;
const SearchIcon = () => <MockIcon name="Search" />;
const XIcon = () => <MockIcon name="X" />;
const ChevronsLeftIcon = () => <MockIcon name="Collapse" />;
const ChevronsRightIcon = () => <MockIcon name="Expand" />;
const SunIcon = () => <MockIcon name="Sun" />;
const MoonIcon = () => <MockIcon name="Moon" />;

// --- Placeholder Components ---
import ChatInterface from './components/chatbot';
import MedicalUploader from './components/settings';
import NewWorkspaceDialog from './components/NewWorkspaceDialog';

// --- Types ---
// Import FileData from a shared types file
import { FileData } from './components/types';

interface ChatSession {
  id: string;
  title: string;
}

interface IconButtonProps {
  icon: React.ReactNode;
  buttonName: string;
  onClick?: () => void;
  disabled?: boolean;
  isExpanded?: boolean;
  className?: string;
}

interface ChatHeaderProps {
  title: string;
  className?: string;
}

interface MainContentProps {
  activeChatId: string | null;
  className?: string;
}

interface SidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onChatSelect: (id: string) => void;
  onSettingsClick: () => void;
  onBackClick: () => void;
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setWorkspaceDetails: React.Dispatch<React.SetStateAction<{ [key: string]: WorkspaceDetails }>>;
  isExpanded: boolean;
  toggleSidebar: () => void;
  showSettings: boolean;
  className?: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface WorkspaceDetails {
  llmPreference: 'offline' | 'online';
  medicalFiles: FileData[];
  patientFiles: FileData[];
}

// --- Components ---

const IconButton: React.FC<IconButtonProps> = ({ icon, buttonName, onClick, disabled, isExpanded = true }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={buttonName}
    style={{
      width: '100%',
      padding: isExpanded ? '10px 12px' : '10px 0',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isExpanded ? 'flex-start' : 'center',
      gap: isExpanded ? '12px' : '0',
      marginTop: '12px',
      background: 'transparent',
      border: '1px solid transparent',
      color: `var(--text-color, #000000)`,
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    }}
    onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = `var(--button-hover-bg, #e0e0e0)`; }}
    onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    <div style={{
      width: '1.5rem',
      height: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    {isExpanded && (
      <div style={{
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: "'Noto Sans', sans-serif",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {buttonName}
      </div>
    )}
  </button>
);

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, className }) => (
  <div
    className={className}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '10px 28px',
      backgroundColor: 'transparent',
      borderBottom: `1px solid var(--border-color, #eee)`,
      marginBottom: '10px',
      flexShrink: 0,
    }}
  >
    <div style={{
      fontSize: '20px',
      fontWeight: 600,
      color: `var(--text-color, black)`,
      fontFamily: "'Montserrat', sans-serif",
      flex: 1,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}>
      {title}
    </div>
    <button
      title="Search Chat"
      style={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `var(--secondary-bg, #E0E0E0)`,
        color: `var(--text-color-secondary, #666)`,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
        flexShrink: 0,
        border: `1px solid var(--border-color, #ddd)`,
        padding: '6px',
      }}
      onClick={() => console.log("Search clicked")}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `var(--button-hover-bg, #e0e0e0)`;
        e.currentTarget.style.color = `var(--text-color, #000)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `var(--secondary-bg, #E0E0E0)`;
        e.currentTarget.style.color = `var(--text-color-secondary, #666)`;
      }}
    >
      <SearchIcon />
    </button>
  </div>
);

const MainContent: React.FC<MainContentProps> = ({ activeChatId, className }) => (
  <div
    className={className}
    style={{
      flex: '1 1 0%',
      border: `1px solid var(--border-color, #ddd)`,
      borderRadius: '16px',
      backgroundColor: `var(--background-color, #FFFFFF)`,
      color: `var(--text-color, black)`,
      height: '100%', // Changed from calc(100% - 16px)
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '20px', // Already 0, kept as is
    }}
  >
    <ChatHeader title={activeChatId ? `Patient Chat` : "Chat"} className={className} />
    <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 28px 20px 28px' }}>
      {activeChatId ? (
        <ChatInterface key={activeChatId} />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', color: `var(--text-color-secondary, #777)` }}>
          Select a patient chat or create a new one.
        </div>
      )}
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  activeChatId,
  onChatSelect,
  onSettingsClick,
  onBackClick,
  setChatSessions,
  setActiveChatId,
  setWorkspaceDetails,
  isExpanded,
  toggleSidebar,
  showSettings,
  className,
  theme,
  toggleTheme,
}) => {
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);

  const handleCreateWorkspace = (workspaceData: { name: string; files: { medical: FileData[]; patient: FileData[] } }) => {
    const newId = Date.now().toString();
    const newTitle = workspaceData.name || `Patient ${newId.slice(-4)}`;
    const newWorkspace: WorkspaceDetails = {
      llmPreference: 'offline',
      medicalFiles: workspaceData.files.medical,
      patientFiles: workspaceData.files.patient,
    };
    setChatSessions((prev) => [...prev, { id: newId, title: newTitle }]);
    setWorkspaceDetails((prev) => ({ ...prev, [newId]: newWorkspace }));
    setActiveChatId(newId);
    setShowNewWorkspaceDialog(false);
  };

  const handleDeleteChat = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    setWorkspaceDetails(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    if (activeChatId === id) {
      const remainingSessions = chatSessions.filter(s => s.id !== id);
      setActiveChatId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  return (
    <div
      className={className}
      style={{
        flexShrink: 0,
        width: isExpanded ? '300px' : '80px',
        backgroundColor: `var(--secondary-bg, #FFFFFF)`,
        border: `1px solid var(--border-color, #ddd)`,
        color: `var(--text-color, black)`,
        borderRadius: '16px',
        height: '100%', // Changed from calc(100% - 16px)
        overflow: 'hidden',
        padding: '20px', // Changed from conditional padding to 0
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.3s ease',
        position: 'relative',
      }}
    >
      <button
        onClick={toggleSidebar}
        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        style={{
          position: 'absolute',
          top: '15px',
          right: isExpanded ? '15px' : 'calc(50% - 15px)',
          transform: isExpanded ? 'none' : 'translateX(50%)',
          zIndex: 10,
          background: `var(--input-bg, #eee)`,
          border: `1px solid var(--border-color, #ccc)`,
          color: `var(--text-color-secondary, #555)`,
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'right 0.3s ease, transform 0.3s ease, background-color 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `var(--button-hover-bg, #e0e0e0)`;
          e.currentTarget.style.color = `var(--text-color, #000)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `var(--input-bg, #eee)`;
          e.currentTarget.style.color = `var(--text-color-secondary, #555)`;
        }}
      >
        {isExpanded ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
      </button>

      <div style={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          height: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isExpanded ? 'flex-start' : 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          paddingRight: isExpanded ? '40px' : '0',
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: isExpanded ? 'auto' : 'none',
          color: `var(--text-color, #1a1a1a)`,
        }}>
          {isExpanded && (
            <>
              <div style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'MuseoModerno, sans-serif', letterSpacing: '0.2rem' }}>
                CAZE LABS
              </div>
              <div style={{ color: `var(--text-color-secondary, #555)`, fontSize: '14px', fontFamily: 'Noto Sans, sans-serif', letterSpacing: '4px', marginTop: '4px' }}>
                MediBot
              </div>
            </>
          )}
        </div>

        {showSettings && (
          <IconButton
            icon={<ArrowLeftIcon />}
            buttonName="Back to Chat"
            onClick={onBackClick}
            isExpanded={isExpanded}
          />
        )}

        <IconButton
          icon={<PlusSquareIcon />}
          buttonName="New Patient"
          onClick={() => setShowNewWorkspaceDialog(true)}
          isExpanded={isExpanded}
        />

        {isExpanded && (
          <div style={{ marginTop: '30px' }}>
            <strong style={{ fontSize: '14px', color: `var(--text-color-secondary, #555)`, paddingLeft: '10px' }}>Recent Patients</strong>
            <div style={{
              maxHeight: 'calc(100vh - 450px)',
              overflowY: 'auto',
              marginTop: '10px',
              paddingRight: '5px',
            }}>
              {chatSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onChatSelect(s.id)}
                  title={s.title}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: activeChatId === s.id ? `var(--accent-color, #1890ff)` : 'transparent',
                    border: `1px solid ${activeChatId === s.id ? 'var(--accent-color, #1890ff)' : 'transparent'}`,
                    color: activeChatId === s.id ? `var(--button-text, #fff)` : `var(--text-color, #333)`,
                    cursor: 'pointer',
                    marginBottom: '6px',
                    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (activeChatId !== s.id) e.currentTarget.style.backgroundColor = `var(--chat-hover-bg, #f0f0f0)`; }}
                  onMouseLeave={(e) => { if (activeChatId !== s.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexGrow: 1, marginRight: '10px' }}>
                    {s.title}
                  </span>
                  <button
                    onClick={(e) => handleDeleteChat(s.id, e)}
                    title="Delete Patient Chat"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: `var(--error-color, #e74c3c)`,
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      opacity: 0.7,
                      transition: 'opacity 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.backgroundColor = `var(--error-hover-bg, rgba(220, 53, 69, 0.1))`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.7';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
              {chatSessions.length === 0 && (
                <div style={{ padding: '10px', color: `var(--text-color-secondary, #888)`, fontSize: '13px', textAlign: 'center' }}>
                  No recent patients.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, borderTop: isExpanded ? `1px solid var(--border-color, #ccc)` : 'none', paddingTop: isExpanded ? '10px' : '0' }}>
        <IconButton
          icon={<SettingsIcon />}
          buttonName="Settings"
          onClick={onSettingsClick}
          disabled={!activeChatId}
          isExpanded={isExpanded}
        />
        <IconButton
          icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
          buttonName={theme === 'light' ? "Dark Mode" : "Light Mode"}
          onClick={toggleTheme}
          isExpanded={isExpanded}
        />
      </div>

      {showNewWorkspaceDialog && (
        <NewWorkspaceDialog
          onClose={() => setShowNewWorkspaceDialog(false)}
          onCreate={handleCreateWorkspace}
          className={className}
        />
      )}
    </div>
  );
};

export const MainScreen: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: 'default1', title: 'John Doe - Follow Up' },
    { id: 'default2', title: 'Jane Smith - Consultation' },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(chatSessions[0]?.id || null);
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [workspaceDetails, setWorkspaceDetails] = useState<{ [key: string]: WorkspaceDetails }>({
    default1: {
      llmPreference: 'offline',
      medicalFiles: [],
      patientFiles: [],
    },
    default2: {
      llmPreference: 'online',
      medicalFiles: [],
      patientFiles: [],
    },
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLLMPreferenceChange = (preference: 'offline' | 'online') => {
    if (!activeChatId || !workspaceDetails[activeChatId]) return;
    setWorkspaceDetails((prev) => ({
      ...prev,
      [activeChatId]: { ...prev[activeChatId], llmPreference: preference },
    }));
  };

  const handleChatSelect = (id: string) => {
    setActiveChatId(id);
    setShowSettings(false);
  };

  const handleSettingsClick = () => {
    if (activeChatId) setShowSettings(true);
  };

  const handleBackClick = () => {
    setShowSettings(false);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div
      className={theme}
      style={{
        width: '100vw',
        height: '100vh',
        fontFamily: "'Noto Sans', Arial, sans-serif",
        display: 'flex',
        backgroundColor: `var(--background-color, #F5F5F5)`,
        color: `var(--text-color, #333)`,
        overflow: 'hidden',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', width: '100%', height: '100%' }}>
        <Sidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onSettingsClick={handleSettingsClick}
          onBackClick={handleBackClick}
          setChatSessions={setChatSessions}
          setActiveChatId={setActiveChatId}
          setWorkspaceDetails={setWorkspaceDetails}
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          showSettings={showSettings}
          className={theme}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        {showSettings ? (
          <div
            className={theme}
            style={{
              flex: '1 1 0%',
              border: `1px solid var(--border-color, #ddd)`,
              borderRadius: '16px',
              backgroundColor: `var(--background-color, #FFFFFF)`,
              color: `var(--text-color, black)`,
              height: '100%', // Changed from calc(100% - 16px)
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              padding: '0', // Explicitly set to 0
            }}
          >
            <MedicalUploader
              onLLMPreferenceChange={handleLLMPreferenceChange}
              className={theme}
              workspaceDetails={{
                llmPreference: 'offline',
                medicalFiles: [],
                patientFiles: [],
              }}
            />
          </div>
        ) : (
          <MainContent activeChatId={activeChatId} className={theme} />
        )}
      </div>
    </div>
  );
};

export default MainScreen;