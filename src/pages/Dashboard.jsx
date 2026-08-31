import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import FolderCard from '../components/FolderCard';
import FileCard from '../components/FileCard';
import CreateFolderModal from '../components/CreateFolderModal';
import { Folder, File, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  // Fetch folders and files from Backend API
  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        setFolders(res.data.folders || []);
        setFiles(res.data.files || []);
        setPath([]);
      } else if (currentFolderId) {
        const res = await api.get(`/folders/${currentFolderId}`);
        setFolders(res.data.children?.folders || []);
        setFiles(res.data.children?.files || []);
        setPath(res.data.path || []);
      } else {
        const res = await api.get('/folders');
        setFolders(res.data.folders || []);
        setFiles(res.data.files || []);
        setPath([]);
      }
    } catch (err) {
      console.error('Error fetching drive contents:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, searchQuery]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

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

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCurrentFolderId(null);
          setSearchQuery('');
        }}
        onOpenCreateFolder={() => setIsFolderModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Breadcrumbs Navigation */}
          <Breadcrumbs
            path={path}
            onNavigate={(id) => setCurrentFolderId(id)}
          />

          {/* Section Heading */}
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl font-bold text-white capitalize flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>{searchQuery ? `Search Results for "${searchQuery}"` : path.length > 0 ? path[path.length - 1].name : 'My Drive'}</span>
            </h2>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : folders.length === 0 && files.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center glass-card rounded-2xl p-8 border border-slate-800 my-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Folder className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-white">This folder is empty</h3>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                Create a new folder or upload files to get started.
              </p>
              <button
                onClick={() => setIsFolderModalOpen(true)}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/20"
              >
                + Create Folder
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Folders Section */}
              {folders.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Folders</h3>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                    {folders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        onOpen={(id) => setCurrentFolderId(id)}
                        onRename={handleRenameFolder}
                        onDelete={handleDeleteFolder}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Files Section */}
              {files.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Files</h3>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onDelete={handleDeleteFile}
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
    </div>
  );
}
