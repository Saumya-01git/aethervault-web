import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import FolderCard from '../components/FolderCard';
import FileCard from '../components/FileCard';
import CreateFolderModal from '../components/CreateFolderModal';
import UploadModal from '../components/UploadModal';
import PreviewModal from '../components/PreviewModal';
import ShareModal from '../components/ShareModal';
import VersionModal from '../components/VersionModal';
import ProfileModal from '../components/ProfileModal';
import ActivityLogModal from '../components/ActivityLogModal';
import SkeletonLoader from '../components/SkeletonLoader';
import CosmicBackground from '../components/CosmicBackground';
import { Folder, Sparkles, Trash2, RotateCcw, ShieldAlert, UploadCloud } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('aether_background_mode') || 'earth');

  const handleSetThemeMode = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('aether_background_mode', mode);
  };
  
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [selectedShareResource, setSelectedShareResource] = useState(null);
  const [selectedVersionFile, setSelectedVersionFile] = useState(null);

  const [isDraggingOverScreen, setIsDraggingOverScreen] = useState(false);

  // Global drag & drop file upload listener
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDraggingOverScreen(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDraggingOverScreen(false);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOverScreen(false);
      dragCounter = 0;
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setDroppedFile(e.dataTransfer.files[0]);
        setIsUploadModalOpen(true);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Fetch folders and files from Backend API
  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        setFolders(res.data.folders || []);
        setFiles(res.data.files || []);
        setPath([]);
      } else if (activeTab === 'starred') {
        const res = await api.get('/stars');
        setFolders(res.data.starredFolders || []);
        setFiles(res.data.starredFiles || []);
        setPath([]);
      } else if (activeTab === 'trash') {
        const res = await api.get('/trash');
        setFolders(res.data.folders || []);
        setFiles(res.data.files || []);
        setPath([]);
      } else if (currentFolderId) {
        const res = await api.get(`/folders/${currentFolderId}`);
        setFolders(res.data.children?.folders || []);
        setFiles(res.data.children?.files || []);
        setPath(res.data.path || []);
        if (typeof res.data.totalBytes === 'number') {
          setTotalStorageBytes(res.data.totalBytes);
        }
      } else {
        const res = await api.get('/folders');
        setFolders(res.data.folders || []);
        setFiles(res.data.files || []);
        setPath([]);
        if (typeof res.data.totalBytes === 'number') {
          setTotalStorageBytes(res.data.totalBytes);
        }
      }
    } catch (err) {
      console.error('Error fetching drive contents:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, searchQuery, activeTab]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Sort Folders and Files
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'date') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === 'size') {
        return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      }
      return 0;
    });
  };

  // Trash Handlers
  const handleRestoreItem = async (resourceType, resourceId) => {
    try {
      await api.post('/trash/restore', { resourceType, resourceId });
      fetchContents();
    } catch (err) {
      console.error('Failed to restore item:', err);
    }
  };

  const handlePurgeItem = async (resourceType, resourceId) => {
    if (confirm('Permanently delete this item? This action cannot be undone.')) {
      try {
        await api.delete('/trash/purge', { data: { resourceType, resourceId } });
        fetchContents();
      } catch (err) {
        console.error('Failed to purge item:', err);
      }
    }
  };

  // Toggle Star Handler
  const handleToggleStar = async (resourceType, resourceId, isStarred) => {
    try {
      if (isStarred) {
        await api.delete('/stars', { data: { resourceType, resourceId } });
      } else {
        await api.post('/stars', { resourceType, resourceId });
      }
      fetchContents();
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  // Folder Actions
  const handleCreateFolder = async (folderName) => {
    await api.post('/folders', { name: folderName, parentId: currentFolderId });
    fetchContents();
  };

  const handleRenameFolder = async (folder) => {
    const newName = prompt('Enter new folder name:', folder.name);
    if (newName && newName.trim() && newName !== folder.name) {
      await api.patch(`/folders/${folder.id}`, { name: newName.trim() });
      fetchContents();
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (confirm('Are you sure you want to move this folder to trash?')) {
      await api.delete(`/folders/${folderId}`);
      fetchContents();
    }
  };

  // File Actions
  const handleDeleteFile = async (fileId) => {
    if (confirm('Are you sure you want to move this file to trash?')) {
      await api.delete(`/files/${fileId}`);
      fetchContents();
    }
  };

  const sortedFolders = sortItems(folders);
  const sortedFiles = sortItems(files);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Dynamic Cosmic Galaxy Background */}
      <CosmicBackground themeMode={themeMode} />

      {/* Global Drag & Drop Overlay */}
      {isDraggingOverScreen && (
        <div className="fixed inset-0 z-50 bg-blue-950/80 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-blue-500 m-4 rounded-3xl animate-in fade-in zoom-in duration-200">
          <div className="w-20 h-20 rounded-3xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/40 shadow-2xl shadow-blue-500/20">
            <UploadCloud className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Drop File to Upload to AetherVault</h2>
          <p className="text-sm text-slate-300">Release mouse to start instant encrypted cloud upload</p>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCurrentFolderId(null);
          setSearchQuery('');
        }}
        onOpenCreateFolder={() => setIsFolderModalOpen(true)}
        onOpenUploadModal={() => {
          setDroppedFile(null);
          setIsUploadModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenActivity={() => setIsActivityModalOpen(true)}
        totalBytes={totalStorageBytes || files.reduce((acc, f) => acc + (f.sizeBytes || 0), 0)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          themeMode={themeMode}
          setThemeMode={handleSetThemeMode}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenActivity={() => setIsActivityModalOpen(true)}
        />

        <main className="flex-1 p-6 overflow-y-auto relative z-10">
          {/* Breadcrumbs Navigation */}
          {activeTab === 'my-drive' && (
            <Breadcrumbs
              path={path}
              onNavigate={(id) => setCurrentFolderId(id)}
            />
          )}

          {/* Quick Stats Cosmic Banner */}
          {activeTab === 'my-drive' && !searchQuery && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="glass-card-cosmic p-3 rounded-2xl flex items-center gap-3 border border-cyan-500/20 shadow-md hover:border-cyan-500/40 transition-all">
                <div className="w-8.5 h-8.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Folder className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vault Inventory</p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {folders.length} Folders · {files.length} Files
                  </p>
                </div>
              </div>

              <div className="glass-card-cosmic p-3 rounded-2xl flex items-center gap-3 border border-blue-500/20 shadow-md hover:border-blue-500/40 transition-all">
                <div className="w-8.5 h-8.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Protocol</p>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>256-Bit Encrypted</span>
                  </p>
                </div>
              </div>

              <div className="glass-card-cosmic p-3 rounded-2xl flex items-center justify-between border border-indigo-500/20 shadow-md hover:border-indigo-500/40 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instant Sync</p>
                    <p className="text-[11px] font-semibold text-slate-200 mt-0.5">Drag & drop files anywhere</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Heading */}
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl font-bold text-white capitalize flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : activeTab === 'starred'
                  ? 'Starred Items'
                  : activeTab === 'trash'
                  ? 'Trash Bin'
                  : activeTab === 'recent'
                  ? 'Recent Files'
                  : path.length > 0
                  ? path[path.length - 1].name
                  : 'My Drive'}
              </span>
            </h2>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <SkeletonLoader viewMode={viewMode} count={4} />
          ) : sortedFolders.length === 0 && sortedFiles.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center glass-card rounded-2xl p-8 border border-slate-800 my-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Folder className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {activeTab === 'starred' ? 'No starred items yet' : activeTab === 'trash' ? 'Trash is empty' : 'This folder is empty'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                {activeTab === 'starred'
                  ? 'Star items to easily find them later.'
                  : activeTab === 'trash'
                  ? 'Deleted items will appear here before permanent deletion.'
                  : 'Upload a file or create a new folder to get started.'}
              </p>
              {activeTab === 'my-drive' && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setDroppedFile(null);
                      setIsUploadModalOpen(true);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/20"
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => setIsFolderModalOpen(true)}
                    className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700/50"
                  >
                    Create Folder
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'trash' ? (
            /* Trash Custom View with Restore & Purge Controls */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Items in Trash are soft-deleted. You can restore them or delete them permanently.</span>
              </div>

              {sortedFolders.map((folder) => (
                <div key={folder.id} className="flex items-center justify-between p-3 rounded-xl glass-card border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-white">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestoreItem('folder', folder.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handlePurgeItem('folder', folder.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Permanently</span>
                    </button>
                  </div>
                </div>
              ))}

              {sortedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-xl glass-card border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium text-white">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestoreItem('file', file.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handlePurgeItem('file', file.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Permanently</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Normal Folder & File Explorer */
            <div className="space-y-8">
              {/* Folders Section */}
              {sortedFolders.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Folders</h3>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                    {sortedFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        onOpen={(id) => setCurrentFolderId(id)}
                        onRename={handleRenameFolder}
                        onDelete={handleDeleteFolder}
                        onShare={(res) => setSelectedShareResource(res)}
                        onToggleStar={handleToggleStar}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Files Section */}
              {sortedFiles.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Files</h3>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                    {sortedFiles.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onPreview={(f) => setSelectedPreviewFile(f)}
                        onDelete={handleDeleteFile}
                        onShare={(res) => setSelectedShareResource(res)}
                        onToggleStar={handleToggleStar}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setDroppedFile(null);
        }}
        currentFolderId={currentFolderId}
        onUploadSuccess={fetchContents}
        initialFile={droppedFile}
      />

      <PreviewModal
        file={selectedPreviewFile}
        isOpen={!!selectedPreviewFile}
        onClose={() => setSelectedPreviewFile(null)}
      />

      <ShareModal
        resource={selectedShareResource}
        isOpen={!!selectedShareResource}
        onClose={() => setSelectedShareResource(null)}
      />

      <VersionModal
        file={selectedVersionFile}
        isOpen={!!selectedVersionFile}
        onClose={() => setSelectedVersionFile(null)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ActivityLogModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />
    </div>
  );
}
