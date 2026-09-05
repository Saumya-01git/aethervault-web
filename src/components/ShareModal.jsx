import React, { useState, useEffect } from 'react';
import { Share2, Users, Link, Copy, Check, Shield, Trash2, Key, Calendar, X, AlertCircle } from 'lucide-react';
import api from '../api/client';

export default function ShareModal({ resource, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('people'); // 'people' | 'link'
  
  // People sharing state
  const [granteeEmail, setGranteeEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [sharesList, setSharesList] = useState([]);
  const [sharing, setSharing] = useState(false);
  
  // Link sharing state
  const [publicLink, setPublicLink] = useState(null);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [creatingLink, setCreatingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && resource) {
      fetchExistingShares();
    }
  }, [isOpen, resource]);

  const fetchExistingShares = async () => {
    try {
      const resourceType = resource.mimeType !== undefined ? 'file' : 'folder';
      const res = await api.get(`/shares/${resourceType}/${resource.id}`);
      setSharesList(res.data.shares || []);
    } catch (err) {
      console.error('Failed to fetch shares:', err);
    }
  };

  if (!isOpen || !resource) return null;

  const resourceType = resource.mimeType !== undefined ? 'file' : 'folder';

  // Handle Share to Email
  const handleShareWithUser = async (e) => {
    e.preventDefault();
    if (!granteeEmail.trim()) return;

    setSharing(true);
    setError('');

    try {
      await api.post('/shares', {
        resourceType,
        resourceId: resource.id,
        granteeEmail: granteeEmail.trim(),
        role
      });
      setGranteeEmail('');
      fetchExistingShares();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to share resource.';
      setError(msg);
    } finally {
      setSharing(false);
    }
  };

  // Handle Revoke User Share
  const handleRevokeShare = async (shareId) => {
    try {
      await api.delete(`/shares/${shareId}`);
      fetchExistingShares();
    } catch (err) {
      console.error('Failed to revoke share:', err);
    }
  };

  // Handle Create Public Link
  const handleCreatePublicLink = async (e) => {
    e.preventDefault();
    setCreatingLink(true);
    setError('');

    try {
      const res = await api.post('/shares/link-shares', {
        resourceType,
        resourceId: resource.id,
        password: password || undefined,
        expiresAt: expiresAt || undefined
      });
      setPublicLink(res.data.shareLink);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to create share link.';
      setError(msg);
    } finally {
      setCreatingLink(false);
    }
  };

  const resolveShareUrl = (url, token) => {
    if (url && !url.includes('localhost:8080') && !url.includes('localhost:10000')) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://aethervault-api.onrender.com/api';
    const serverRoot = apiBase.replace(/\/api\/?$/, '');
    return `${serverRoot}/api/shares/link/${token}`;
  };

  // Copy Link to Clipboard
  const handleCopyLink = () => {
    if (publicLink?.token) {
      const shareUrlToCopy = resolveShareUrl(publicLink.shareUrl, publicLink.token);
      navigator.clipboard.writeText(shareUrlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Share2 className="w-5 h-5 text-blue-400" />
            <span className="truncate max-w-[280px]">Share "{resource.name}"</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'people' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Share with People</span>
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'link' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Public Link</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Share with People (ACL) */}
        {activeTab === 'people' && (
          <div className="space-y-4">
            <form onSubmit={handleShareWithUser} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter user email..."
                value={granteeEmail}
                onChange={(e) => setGranteeEmail(e.target.value)}
                className="flex-1 glass-input rounded-xl px-3 py-2 text-xs"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="glass-input rounded-xl px-2 py-2 text-xs bg-slate-900"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <button
                type="submit"
                disabled={sharing}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {sharing ? 'Sending...' : 'Invite'}
              </button>
            </form>

            {/* List of Shared Users */}
            <div className="mt-4">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">People with Access</h4>
              {sharesList.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">Not shared with anyone yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sharesList.map((share) => (
                    <div key={share.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div>
                        <p className="font-medium text-slate-200">{share.granteeName || share.granteeEmail}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{share.role} role</p>
                      </div>
                      <button
                        onClick={() => handleRevokeShare(share.id)}
                        title="Revoke access"
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Public Share Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            {!publicLink ? (
              <form onSubmit={handleCreatePublicLink} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    <span>Optional Password Protection</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Leave empty for no password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Optional Expiration Date</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingLink}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Link className="w-4 h-4" />
                  <span>{creatingLink ? 'Generating Link...' : 'Create Share Link'}</span>
                </button>
              </form>
            ) : (
              /* Display Generated Link */
              <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Public Link Created</span>
                  {publicLink.hasPassword && <span className="text-[10px] text-amber-400 flex items-center gap-1"><Shield className="w-3 h-3" /> Password Protected</span>}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={resolveShareUrl(publicLink.shareUrl, publicLink.token)}
                    className="flex-1 glass-input rounded-xl px-3 py-2 text-xs bg-slate-950 font-mono text-slate-300"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 shadow-md shadow-blue-600/20"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                {publicLink.expiresAt && (
                  <p className="text-[10px] text-slate-400">Expires: {new Date(publicLink.expiresAt).toLocaleString()}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
