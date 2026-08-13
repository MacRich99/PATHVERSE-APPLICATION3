import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Mail,
  Phone,
  Building,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Globe,
  ExternalLink,
  ShieldCheck,
  X,
  Send,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
} from '../lib/googleAuth';
import {
  GoogleContact,
  fetchGoogleContacts,
  createGoogleContact,
  deleteGoogleContact,
} from '../lib/contactsApi';

interface ContactsScreenProps {
  user: UserProfile;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({ user }) => {
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Contact Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGivenName, setNewGivenName] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrganization, setNewOrganization] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');

  // Explicit User Confirmation Modal States (Required for Workspace Integrations)
  const [confirmCreateContact, setConfirmCreateContact] = useState<{
    givenName: string;
    familyName?: string;
    email?: string;
    phone?: string;
    organization?: string;
    jobTitle?: string;
  } | null>(null);

  const [confirmDeleteContact, setConfirmDeleteContact] = useState<GoogleContact | null>(null);

  // Invited Contacts State (Local UI tracking)
  const [invitedEmails, setInvitedEmails] = useState<Record<string, boolean>>({});
  const [studyPartners, setStudyPartners] = useState<Record<string, boolean>>({});

  // Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (u, token) => {
        setGoogleUser(u);
        setAccessToken(token);
        loadContacts(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setContacts([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadContacts = async (token: string) => {
    setIsLoadingContacts(true);
    setErrorMessage(null);
    try {
      const fetched = await fetchGoogleContacts(token);
      setContacts(fetched);
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
      setErrorMessage(err.message || 'Failed to load Google Contacts.');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        await loadContacts(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setErrorMessage('Google Sign-In failed or was cancelled.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
    setContacts([]);
  };

  // Step 1: Trigger Add Modal
  const handleOpenAddModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGivenName.trim()) {
      alert('First name is required.');
      return;
    }

    // Prepare confirmation data
    setConfirmCreateContact({
      givenName: newGivenName.trim(),
      familyName: newFamilyName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      organization: newOrganization.trim(),
      jobTitle: newJobTitle.trim(),
    });
  };

  // Step 2: Execute Create Contact after User explicitly Confirms in Modal
  const executeCreateContact = async () => {
    if (!accessToken || !confirmCreateContact) return;

    setIsLoadingContacts(true);
    setErrorMessage(null);
    try {
      const newContact = await createGoogleContact(accessToken, confirmCreateContact);
      setContacts((prev) => [newContact, ...prev]);
      setSuccessMessage(`Successfully added ${newContact.name} to your Google Contacts!`);
      
      // Reset form
      setNewGivenName('');
      setNewFamilyName('');
      setNewEmail('');
      setNewPhone('');
      setNewOrganization('');
      setNewJobTitle('');
      setIsAddModalOpen(false);
      setConfirmCreateContact(null);

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error creating contact:', err);
      setErrorMessage(err.message || 'Failed to add contact.');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Step 1: Prompt Delete Confirmation
  const handlePromptDelete = (contact: GoogleContact) => {
    setConfirmDeleteContact(contact);
  };

  // Step 2: Execute Delete Contact after User explicitly Confirms
  const executeDeleteContact = async () => {
    if (!accessToken || !confirmDeleteContact) return;

    setIsLoadingContacts(true);
    setErrorMessage(null);
    try {
      await deleteGoogleContact(accessToken, confirmDeleteContact.resourceName);
      setContacts((prev) => prev.filter((c) => c.resourceName !== confirmDeleteContact.resourceName));
      setSuccessMessage(`Removed ${confirmDeleteContact.name} from Google Contacts.`);
      setConfirmDeleteContact(null);

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error deleting contact:', err);
      setErrorMessage(err.message || 'Failed to delete contact.');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const toggleInvite = (contactEmail: string, name: string) => {
    if (!contactEmail) return;
    setInvitedEmails((prev) => ({
      ...prev,
      [contactEmail]: !prev[contactEmail],
    }));
    setSuccessMessage(`PathVerse study invitation sent to ${name} (${contactEmail})!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const toggleStudyPartner = (resourceName: string, name: string) => {
    setStudyPartners((prev) => ({
      ...prev,
      [resourceName]: !prev[resourceName],
    }));
  };

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.organization?.toLowerCase().includes(q) ||
      c.jobTitle?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#F2AF29] uppercase tracking-widest mb-1">
              <Users className="w-4 h-4 text-[#F2AF29]" />
              <span>Google Workspace Contacts Integration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Google Contacts Network
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md opacity-80 mt-1">
              Seamlessly sync your personal and professional Google Contacts to build your study mentor network and invite peers.
            </p>
          </div>

          {/* Connection Status Badge & Toggle */}
          {googleUser && accessToken ? (
            <div className="flex flex-col sm:items-end gap-2">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-2xl text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Connected as {googleUser.email}</span>
              </div>
              <button
                onClick={handleGoogleSignOut}
                className="text-[11px] text-slate-400 hover:text-rose-400 font-semibold cursor-pointer underline transition-colors"
              >
                Disconnect Google Account
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="gsi-material-button shadow-lg hover:scale-105 transition-transform"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-bold text-xs">Sign in with Google</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Notifications / Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      {!accessToken ? (
        <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">Connect Your Google Account</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sign in with your Google Account to access your personal Google Contacts directly inside PathVerse. Easily invite contacts to study cohorts or manage mentors.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="gsi-material-button shadow-xl hover:scale-105 transition-transform"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-bold text-sm">Sign in with Google</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar: Search & Add Contact Button */}
          <div className="bg-[#1C1F37] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google contacts by name, email, org..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#F2AF29]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => loadContacts(accessToken)}
                disabled={isLoadingContacts}
                className="p-2.5 rounded-xl bg-[#0B0D17] border border-white/10 text-slate-300 hover:text-white hover:border-[#F2AF29] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Sync Google Contacts"
              >
                <RefreshCw className={`w-4 h-4 text-[#F2AF29] ${isLoadingContacts ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Contacts</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#F2AF29]/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Contact</span>
              </button>
            </div>
          </div>

          {/* Contacts List */}
          {isLoadingContacts && contacts.length === 0 ? (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-12 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#F2AF29] border-t-transparent animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 font-medium">Fetching Google Contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-12 text-center space-y-3">
              <Users className="w-8 h-8 text-[#F2AF29] mx-auto opacity-50" />
              <p className="text-sm font-bold text-white">No contacts found</p>
              <p className="text-xs text-slate-400">
                {searchQuery ? `No Google contacts matching "${searchQuery}".` : 'Your Google Contacts list is empty or sync is in progress.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContacts.map((contact) => {
                const isInvited = contact.email ? !!invitedEmails[contact.email] : false;
                const isPartner = !!studyPartners[contact.resourceName];

                return (
                  <div
                    key={contact.resourceName}
                    className="bg-[#1C1F37] border border-white/10 hover:border-[#F2AF29]/40 rounded-2xl p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Avatar & Main Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] font-bold text-lg shadow-md shrink-0 overflow-hidden">
                            {contact.photoUrl ? (
                              <img src={contact.photoUrl} alt={contact.name} className="w-full h-full object-cover" />
                            ) : (
                              contact.name.charAt(0).toUpperCase()
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white leading-snug">{contact.name}</h4>
                            {(contact.jobTitle || contact.organization) && (
                              <p className="text-[11px] text-[#F2AF29] font-medium flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3 text-[#F2AF29] shrink-0" />
                                <span>
                                  {contact.jobTitle ? `${contact.jobTitle}` : ''}
                                  {contact.jobTitle && contact.organization ? ' at ' : ''}
                                  {contact.organization ? contact.organization : ''}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Delete Trigger */}
                        <button
                          onClick={() => handlePromptDelete(contact)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          title="Delete contact from Google Contacts"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-1.5 text-xs text-slate-300 bg-[#0B0D17] p-3 rounded-xl border border-white/5">
                        {contact.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-[#F2AF29] shrink-0" />
                            <a href={`mailto:${contact.email}`} className="hover:underline truncate text-slate-200 font-mono text-[11px]">
                              {contact.email}
                            </a>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 italic">No email address listed</div>
                        )}

                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-[#F2AF29] shrink-0" />
                            <a href={`tel:${contact.phone}`} className="hover:underline font-mono text-[11px]">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Controls */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleStudyPartner(contact.resourceName, contact.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPartner
                            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold'
                            : 'bg-[#0B0D17] border border-white/10 text-slate-300 hover:text-white hover:border-[#F2AF29]/40'
                        }`}
                      >
                        <UserCheck className={`w-3.5 h-3.5 ${isPartner ? 'text-emerald-400' : 'text-[#F2AF29]'}`} />
                        <span>{isPartner ? 'Study Mentor' : '+ Add as Mentor'}</span>
                      </button>

                      {contact.email && (
                        <button
                          onClick={() => toggleInvite(contact.email!, contact.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isInvited
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] shadow-md'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isInvited ? 'Invite Sent' : 'Invite to PathVerse'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D17]/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0B0D17] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add New Google Contact</h3>
                <p className="text-xs text-slate-400">Save a contact directly to your Google Account.</p>
              </div>
            </div>

            <form onSubmit={handleOpenAddModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGivenName}
                    onChange={(e) => setNewGivenName(e.target.value)}
                    placeholder="e.g. Maya"
                    className="w-full p-3 rounded-xl bg-[#0B0D17] border border-white/10 text-white focus:outline-none focus:border-[#F2AF29]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    placeholder="e.g. Patel"
                    className="w-full p-3 rounded-xl bg-[#0B0D17] border border-white/10 text-white focus:outline-none focus:border-[#F2AF29]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. maya.patel@example.com"
                  className="w-full p-3 rounded-xl bg-[#0B0D17] border border-white/10 text-white focus:outline-none focus:border-[#F2AF29]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +1 555 019 2831"
                  className="w-full p-3 rounded-xl bg-[#0B0D17] border border-white/10 text-white focus:outline-none focus:border-[#F2AF29]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={newOrganization}
                    onChange={(e) => setNewOrganization(e.target.value)}
                    placeholder="e.g. PathVerse Labs"
                    className="w-full p-3 rounded-xl bg-[#0B0D17] border border-white/10 text-white focus:outline-none focus:border-[#F2AF29]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. AI Mentor"
                    className="w-full p-3 rounded-xl bg-[#0B0D17] border border-white/10 text-white focus:outline-none focus:border-[#F2AF29]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0B0D17] border border-white/10 text-slate-300 font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold uppercase tracking-wider shadow-lg shadow-[#F2AF29]/20"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR CREATING GOOGLE CONTACT */}
      {confirmCreateContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D17]/95 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#1C1F37] border border-[#F2AF29]/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F2AF29]/10 border border-[#F2AF29] flex items-center justify-center text-[#F2AF29]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Google Contact Creation</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to add <strong>{confirmCreateContact.givenName} {confirmCreateContact.familyName}</strong> directly to your Google Account contacts?
            </p>

            <div className="bg-[#0B0D17] p-3 rounded-xl border border-white/10 text-xs space-y-1 font-mono text-slate-300">
              <p><strong>Name:</strong> {confirmCreateContact.givenName} {confirmCreateContact.familyName}</p>
              {confirmCreateContact.email && <p><strong>Email:</strong> {confirmCreateContact.email}</p>}
              {confirmCreateContact.phone && <p><strong>Phone:</strong> {confirmCreateContact.phone}</p>}
              {confirmCreateContact.organization && <p><strong>Org:</strong> {confirmCreateContact.organization}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmCreateContact(null)}
                className="px-4 py-2 rounded-xl bg-[#0B0D17] border border-white/10 text-slate-300 font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeCreateContact}
                className="px-5 py-2 rounded-xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold uppercase tracking-wider"
              >
                Confirm Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DELEING GOOGLE CONTACT */}
      {confirmDeleteContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D17]/95 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#1C1F37] border border-rose-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500 flex items-center justify-center text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Google Contact Deletion</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove <strong>{confirmDeleteContact.name}</strong> from your Google Account contacts? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteContact(null)}
                className="px-4 py-2 rounded-xl bg-[#0B0D17] border border-white/10 text-slate-300 font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteContact}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
