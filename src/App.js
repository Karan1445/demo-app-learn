import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

const DB_NAME = 'professional-user-list';
const DB_VERSION = 3;
const STORE_NAME = 'users';
const SEED_MARKER_KEY = 'professional-user-list-seed';
const SEED_MARKER_VALUE = 'tailwind-ui-v1';

const statusOptions = ['active', 'pending', 'banned', 'rejected'];
const roleOptions = ['CEO', 'CTO', 'Project Coordinator', 'Team Leader', 'Software Developer', 'Network Engineer', 'IT Administrator'];

const avatar = (seed) => `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

const seedUsers = [
  { id: 1, name: 'Angelique Morse', email: 'benny89@yahoo.com', phone: '+46 8 123 456', company: 'Wuckert Inc', role: 'CEO', status: 'banned', avatarUrl: avatar('Angelique Morse') },
  { id: 2, name: 'Ariana Lang', email: 'avery43@hotmail.com', phone: '+54 11 1234-5678', company: 'Feest Group', role: 'IT Administrator', status: 'pending', avatarUrl: avatar('Ariana Lang') },
  { id: 3, name: 'Aspen Schmitt', email: 'mireya13@hotmail.com', phone: '+34 91 123 4567', company: 'Kihn, Marquardt and Crist', role: 'Project Coordinator', status: 'banned', avatarUrl: avatar('Aspen Schmitt') },
  { id: 4, name: 'Colten Aguilar', email: 'dasia.jenkins@hotmail.com', phone: '+31 20 123 4567', company: 'Nolan - Kunde', role: 'Network Engineer', status: 'pending', avatarUrl: avatar('Colten Aguilar') },
  { id: 5, name: 'Harrison Stein', email: 'violet.ratke86@yahoo.com', phone: '+61 2 9876 5432', company: 'Hegmann, Krieger and Bayer', role: 'Team Leader', status: 'pending', avatarUrl: avatar('Harrison Stein') },
  { id: 6, name: 'Lucian Obrien', email: 'ashlynn.ohara62@gmail.com', phone: '+1 416-555-0198', company: 'Gleichner, Mueller and Tromp', role: 'CTO', status: 'pending', avatarUrl: avatar('Lucian Obrien') },
  { id: 7, name: 'Damon Ortiz', email: 'damon.ortiz@gmail.com', phone: '+1 415 555 0119', company: 'Herman and Sons', role: 'Software Developer', status: 'pending', avatarUrl: avatar('Damon Ortiz') },
  { id: 8, name: 'Elaine Walsh', email: 'elaine.walsh@yahoo.com', phone: '+44 20 7946 0244', company: 'Schowalter Group', role: 'CEO', status: 'banned', avatarUrl: avatar('Elaine Walsh') },
  { id: 9, name: 'Finnley Cruz', email: 'finnley.cruz@mail.com', phone: '+61 2 9374 4000', company: 'Kunde, Renner and Bahringer', role: 'Team Leader', status: 'pending', avatarUrl: avatar('Finnley Cruz') },
  { id: 10, name: 'Gina Porter', email: 'gina.porter@icloud.com', phone: '+49 30 123456', company: 'Torphy-McKenzie', role: 'Project Coordinator', status: 'rejected', avatarUrl: avatar('Gina Porter') },
  { id: 11, name: 'Harvey Long', email: 'harvey.long@hotmail.com', phone: '+81 3 1234 5678', company: 'Lemke PLC', role: 'Software Developer', status: 'banned', avatarUrl: avatar('Harvey Long') },
  { id: 12, name: 'Iris Bennett', email: 'iris.bennett@gmail.com', phone: '+91 22 1234 5678', company: 'Mraz, Nader and Quigley', role: 'CTO', status: 'pending', avatarUrl: avatar('Iris Bennett') },
  { id: 13, name: 'Jalen Ross', email: 'jalen.ross@outlook.com', phone: '+33 1 23 45 67 89', company: 'Rutherford Ltd', role: 'CEO', status: 'active', avatarUrl: avatar('Jalen Ross') },
  { id: 14, name: 'Kira Holmes', email: 'kira.holmes@yahoo.com', phone: '+31 20 123 4567', company: 'Osinski Group', role: 'Software Developer', status: 'banned', avatarUrl: avatar('Kira Holmes') },
  { id: 15, name: 'Luca Reeves', email: 'luca.reeves@gmail.com', phone: '+39 06 6988 1', company: 'Moore, Pacocha and Rau', role: 'Project Coordinator', status: 'pending', avatarUrl: avatar('Luca Reeves') },
  { id: 16, name: 'Maya Fletcher', email: 'maya.fletcher@mail.com', phone: '+27 11 123 4567', company: 'Dach LLC', role: 'Network Engineer', status: 'active', avatarUrl: avatar('Maya Fletcher') },
  { id: 17, name: 'Nolan Barker', email: 'nolan.barker@hotmail.com', phone: '+82 2 1234 5678', company: 'Collier, Stark and Zieme', role: 'Team Leader', status: 'pending', avatarUrl: avatar('Nolan Barker') },
  { id: 18, name: 'Ophelia Knight', email: 'ophelia.knight@gmail.com', phone: '+47 21 93 00 00', company: 'Bins and Sons', role: 'IT Administrator', status: 'rejected', avatarUrl: avatar('Ophelia Knight') },
  { id: 19, name: 'Parker Ellis', email: 'parker.ellis@yahoo.com', phone: '+55 11 91234-5678', company: 'Kassulke Inc', role: 'CEO', status: 'banned', avatarUrl: avatar('Parker Ellis') },
  { id: 20, name: 'Quinn Foster', email: 'quinn.foster@outlook.com', phone: '+64 9 123 4567', company: 'Blick, West and White', role: 'CTO', status: 'pending', avatarUrl: avatar('Quinn Foster') },
];

const emptyForm = {
  avatarUrl: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  role: 'CEO',
  status: 'active',
};

const statusBadgeClasses = {
  active: 'bg-[#d8f7e7] text-[#00a76f]',
  pending: 'bg-[#fff1d6] text-[#b76e00]',
  banned: 'bg-[#ffe0dc] text-[#d71920]',
  rejected: 'bg-[#edf2f6] text-[#637381]',
};

const countBadgeClasses = {
  all: 'bg-[#172230] text-[#f8fafc]',
  active: 'bg-[#d8f7e7] text-[#00a76f]',
  pending: 'bg-[#ffab00] text-[#09111f]',
  banned: 'bg-[#ffe0dc] text-[#91111a]',
  rejected: 'bg-[#edf2f6] text-[#34495e]',
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('role', 'role', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runStore(mode, callback) {
  return openDatabase().then((db) => (
    new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const result = callback(store);

      transaction.oncomplete = () => {
        db.close();
        resolve(result);
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    })
  ));
}

async function getUsers() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function seedDatabaseIfNeeded() {
  const currentMarker = window.localStorage?.getItem(SEED_MARKER_KEY);
  const existingUsers = await getUsers();

  if (existingUsers.length && currentMarker === SEED_MARKER_VALUE) {
    return existingUsers;
  }

  await runStore('readwrite', (store) => {
    store.clear();
    seedUsers.forEach((user) => store.put(user));
  });
  window.localStorage?.setItem(SEED_MARKER_KEY, SEED_MARKER_VALUE);

  return getUsers();
}

async function saveUser(user) {
  await runStore('readwrite', (store) => store.put(user));
}

async function removeUser(id) {
  await runStore('readwrite', (store) => store.delete(id));
}

async function removeUsers(ids) {
  await runStore('readwrite', (store) => {
    ids.forEach((id) => store.delete(id));
  });
}

async function getNextId() {
  const users = await getUsers();
  return users.reduce((highestId, user) => Math.max(highestId, Number(user.id)), 0) + 1;
}

function compactRoleLabel(selectedRoles) {
  if (!selectedRoles.length) return 'Role';
  const label = selectedRoles.join(', ');
  return label.length > 21 ? `${label.slice(0, 21)}...` : label;
}

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDense, setIsDense] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [tabScroll, setTabScroll] = useState({ canScrollLeft: false, canScrollRight: false });
  const roleRef = useRef(null);
  const tabsRef = useRef(null);
  const denseEnabled = isDense;

  async function refreshUsers() {
    const databaseUsers = await getUsers();
    setUsers(databaseUsers);
  }

  useEffect(() => {
    let isMounted = true;

    seedDatabaseIfNeeded()
      .then((databaseUsers) => {
        if (isMounted) setUsers(databaseUsers);
      })
      .catch((error) => {
        if (isMounted) setDbError(error?.message || 'Unable to open IndexedDB.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function closeDropdown(event) {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
    }

    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedStatus, selectedRoles, search, rowsPerPage]);

  const counts = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc.all += 1;
        acc[user.status] += 1;
        return acc;
      },
      { all: 0, active: 0, pending: 0, banned: 0, rejected: 0 }
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users
      .filter((user) => !selectedStatus || selectedStatus === 'all' || user.status === selectedStatus)
      .filter((user) => selectedRoles.length === 0 || selectedRoles.includes(user.role))
      .filter((user) => {
        if (!searchValue) return true;
        return [user.name, user.email, user.phone, user.company, user.role, user.status]
          .join(' ')
          .toLowerCase()
          .includes(searchValue);
      })
      .sort((a, b) => {
        const first = String(a[sortConfig.key] || '').toLowerCase();
        const second = String(b[sortConfig.key] || '').toLowerCase();
        const result = first.localeCompare(second, undefined, { numeric: true });
        return sortConfig.direction === 'asc' ? result : -result;
      });
  }, [users, selectedStatus, selectedRoles, search, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * rowsPerPage;
  const visibleUsers = filteredUsers.slice(pageStart, pageStart + rowsPerPage);
  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selectedIds.includes(user.id));
  const activeFilters = selectedStatus !== 'all' || selectedRoles.length > 0 || search.trim() !== '';

  function handleSort(key) {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  function toggleRole(role) {
    setSelectedRoles((current) => (
      current.includes(role) ? current.filter((item) => item !== role) : [...current, role]
    ));
  }

  function removeRole(role) {
    setSelectedRoles((current) => current.filter((item) => item !== role));
  }

  function clearFilters() {
    setSearch('');
    setSelectedStatus('all');
    setSelectedRoles([]);
  }

  function openCreateForm() {
    setEditingUser(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditForm(user) {
    setEditingUser(user);
    setForm({
      avatarUrl: user.avatarUrl || '',
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role,
      status: user.status,
    });
    setIsFormOpen(true);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const id = editingUser ? editingUser.id : await getNextId();
    const nextUser = {
      ...form,
      id,
      avatarUrl: form.avatarUrl.trim() || avatar(form.name || `user-${id}`),
    };

    await saveUser(nextUser);
    await refreshUsers();
    setIsFormOpen(false);
    setEditingUser(null);
    setForm(emptyForm);
  }

  async function handleDeleteOne() {
    await removeUser(deleteTarget.id);
    await refreshUsers();
    setSelectedIds((current) => current.filter((id) => id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  async function deleteSelected() {
    await removeUsers(selectedIds);
    await refreshUsers();
    setSelectedIds([]);
  }

  function toggleAllFiltered() {
    if (allFilteredSelected) {
      setSelectedIds((current) => current.filter((id) => !filteredUsers.some((user) => user.id === id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...filteredUsers.map((user) => user.id)])));
  }

  function toggleOne(id) {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    ));
  }

  function updateTabScrollState() {
    if (!tabsRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
    const threshold = 2;

    setTabScroll({
      canScrollLeft: scrollLeft > threshold,
      canScrollRight: scrollLeft < maxScrollLeft - threshold,
    });
  }

  function scrollTabs(direction) {
    if (!tabsRef.current) return;
    tabsRef.current.scrollBy({ left: direction * 220, behavior: 'smooth' });
  }

  useEffect(() => {
    updateTabScrollState();
    window.addEventListener('resize', updateTabScrollState);
    return () => window.removeEventListener('resize', updateTabScrollState);
  }, [selectedStatus, users.length]);

  return (
    <Fragment>
      <main className="min-h-screen bg-[#f6f8fb] px-2 py-3 text-[#071426] sm:px-6 sm:py-5 lg:px-[38px] lg:py-8">
        <div className="mx-auto max-w-[1420px]">
        <header className="mb-6 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8 lg:gap-12">
          <div className="min-w-0">
            <h1 className="mb-4 text-[28px] font-bold leading-none tracking-normal text-[#071426] sm:mb-6 sm:text-[31px]">List</h1>
            <nav className="flex items-center gap-3 overflow-x-auto text-[14px] text-[#071426] sm:gap-5 sm:text-[18px]" aria-label="Breadcrumb">
              <span>Dashboard</span>
              <span className="h-1 w-1 rounded-full bg-[#8a98a8]" />
              <span>User</span>
              <span className="h-1 w-1 rounded-full bg-[#8a98a8]" />
              <span className="text-[#8a98a8]">List</span>
            </nav>
          </div>

          <button
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#172230] px-5 text-[16px] font-bold text-white shadow-sm transition hover:bg-[#223244] sm:mt-0 sm:w-auto sm:text-[17px]"
            type="button"
            onClick={openCreateForm}
          >
            <PlusIcon className="h-6 w-6" />
            Add user
          </button>
        </header>

        <section className="overflow-visible rounded-[22px] border border-[#edf1f4] bg-white shadow-[0_24px_80px_rgba(15,28,43,0.06)]" aria-label="Users">
          <div className="flex min-h-[60px] items-center gap-2 border-b border-[#edf1f4] px-2 sm:gap-4 sm:px-6">
            <button
              className={cx(
                'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#637381] transition-all duration-300 ease-out hover:bg-[#f4f6f8] hover:text-[#172230] sm:hidden',
                !tabScroll.canScrollLeft && 'pointer-events-none invisible'
              )}
              type="button"
              onClick={() => scrollTabs(-1)}
              aria-label="Scroll tabs left"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div ref={tabsRef} onScroll={updateTabScrollState} className="scrollbar-hide flex min-h-[60px] flex-1 items-center gap-4 overflow-x-auto sm:gap-9">
              {['all', ...statusOptions].map((status) => (
              <button
                key={status}
                type="button"
                className={cx(
                  'relative inline-flex min-h-[60px] items-center gap-2 whitespace-nowrap text-[15px] capitalize text-[#52677a] transition-all duration-300 ease-out sm:text-[18px]',
                  selectedStatus === status && 'font-bold text-[#071426] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[3px] after:bg-[#172230]'
                )}
                onClick={() => setSelectedStatus(status)}
              >
                <span>{status}</span>
                <strong className={cx('min-w-[28px] rounded-lg px-2 py-[6px] text-center text-[13px] font-bold leading-none transition-all duration-300 ease-out sm:min-w-[31px] sm:text-[15px]', countBadgeClasses[status])}>
                  {counts[status]}
                </strong>
              </button>
              ))}
            </div>

            <button
              className={cx(
                'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#637381] transition-all duration-300 ease-out hover:bg-[#f4f6f8] hover:text-[#172230] sm:hidden',
                !tabScroll.canScrollRight && 'pointer-events-none invisible'
              )}
              type="button"
              onClick={() => scrollTabs(1)}
              aria-label="Scroll tabs right"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="relative z-20 grid items-start gap-3 border-b border-[#f1f4f7] px-2 py-4 sm:gap-5 sm:px-6 sm:py-[26px] lg:grid-cols-[250px_minmax(0,1fr)_40px]">
            <div className="relative" ref={roleRef}>
              <button
                className={cx(
                  'relative flex h-14 w-full items-center justify-between rounded-[9px] border bg-white px-4 text-left transition-all duration-200 ease-out sm:h-[70px]',
                  isRoleOpen ? 'border-[#172230] shadow-[0_0_0_4px_rgba(23,34,48,0.04)]' : 'border-[#dfe5eb]'
                )}
                type="button"
                onClick={() => setIsRoleOpen((value) => !value)}
              >
                <span
                  className={cx(
                    'pointer-events-none absolute left-3 bg-white px-1 font-semibold leading-none text-[#071426] transition-all duration-200 ease-out',
                    isRoleOpen || selectedRoles.length > 0
                      ? 'top-[-10px] text-[12px] opacity-100 sm:text-[14px]'
                      : 'top-1/2 -translate-y-1/2 text-[15px] opacity-85 sm:text-[18px]'
                  )}
                >
                  Role
                </span>
                <span className="max-w-[178px] truncate pt-[2px] text-[15px] leading-none text-[#071426] sm:text-[19px]">
                  {selectedRoles.length > 0 ? compactRoleLabel(selectedRoles) : '\u00A0'}
                </span>
                <ChevronDownIcon className={cx('h-5 w-5 text-[#637381] transition', isRoleOpen && 'rotate-180')} />
              </button>

              {isRoleOpen && (
                <div className="scrollbar-hide absolute left-0 top-[58px] z-50 max-h-[300px] w-full overflow-y-auto rounded-xl bg-white py-3 shadow-[0_24px_80px_rgba(15,28,43,0.16)] ring-1 ring-[#edf1f4] sm:left-[-36px] sm:top-[70px] sm:w-[320px]">
                  {roleOptions.map((role) => {
                    const isSelected = selectedRoles.includes(role);

                    return (
                      <label
                        key={role}
                        className={cx(
                          'mx-2 mb-1 flex h-[54px] cursor-pointer items-center gap-3 rounded-md px-3 text-[18px] font-semibold text-[#212b36]',
                          isSelected ? 'bg-[#eef3f3]' : 'bg-white hover:bg-[#f6f8fa]'
                        )}
                      >
                        <input className="sr-only" type="checkbox" checked={isSelected} onChange={() => toggleRole(role)} />
                        <span
                          className={cx(
                            'flex h-5 w-5 items-center justify-center rounded-[5px] border leading-none',
                            isSelected ? 'border-[#00a76f] bg-[#00a76f] text-white' : 'border-[#637789] bg-white'
                          )}
                        >
                          {isSelected && <CheckIcon className="block h-3.5 w-3.5" />}
                        </span>
                        <span>{role}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <label className="flex h-[70px] min-w-0 items-center gap-3 rounded-[9px] border border-[#dfe5eb] bg-white px-5 text-[#8a98a8] transition-all duration-300 ease-out focus-within:border-[#172230]">
              <SearchIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
              <input
                className="h-full min-w-0 flex-1 border-0 bg-transparent text-[16px] text-[#071426] outline-none placeholder:text-[#8a98a8] sm:text-[20px]"
                type="search"
                value={search}
                placeholder="Search..."
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {activeFilters && (
            <div className="px-2 pb-5 pt-4 sm:px-6 sm:pb-[26px] sm:pt-6">
              <p className="mb-4 text-[15px] text-[#52677a] sm:mb-[18px] sm:text-[20px]">
                <strong className="font-bold text-[#0b2a4a]">{filteredUsers.length}</strong> results found
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {selectedStatus !== 'all' && (
                  <Chip label="Status" value={selectedStatus} onRemove={() => setSelectedStatus('all')} />
                )}

                {selectedRoles.length > 0 && (
                  <div className="flex min-h-[50px] flex-wrap items-center gap-2 rounded-xl border border-dashed border-[#dfe5eb] px-3">
                    <strong className="mr-1 text-[16px] text-[#071426] sm:text-[18px]">Role:</strong>
                    {selectedRoles.map((role) => (
                      <button
                        key={role}
                        className="inline-flex h-[30px] items-center gap-2 rounded-lg bg-[#eef2f6] px-3 text-[14px] font-semibold leading-none text-[#071426] sm:text-[16px]"
                        type="button"
                        onClick={() => removeRole(role)}
                      >
                        {role}
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#8a98a8] text-[12px] font-bold leading-none text-white">
                          <span className="-mt-px block">x</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {search.trim() && (
                  <Chip label="Keyword" value={search.trim()} onRemove={() => setSearch('')} />
                )}

                <button className="inline-flex h-[50px] items-center gap-2 rounded-lg px-3 text-[16px] font-bold text-[#ff5630] transition-all duration-300 ease-out hover:bg-[#fff5f3] sm:text-[18px]" type="button" onClick={clearFilters}>
                  <TrashIcon className="h-5 w-5" />
                  Clear
                </button>
              </div>
            </div>
          )}

          {!loading && dbError && (
            <div className="px-2 py-4 sm:px-6">
              <div className="rounded-2xl border border-[#ffe0dc] bg-[#fff5f3] px-4 py-5 text-center font-semibold text-[#d71920]">
                {dbError}
              </div>
            </div>
          )}

          {!loading && !dbError && visibleUsers.length === 0 && (
            <div className="px-3 py-4 sm:px-6 lg:hidden">
              <div className="rounded-2xl border border-dashed border-[#dfe5eb] bg-[#fbfcfd] px-4 py-12 text-center font-semibold text-[#637381]">
                No users found.
              </div>
            </div>
          )}

          {loading && (
            <div className="px-3 py-10 text-center font-semibold text-[#637381] sm:px-6 lg:hidden">
              Loading users from IndexedDB...
            </div>
          )}

          {selectedIds.length > 0 && (
            <div className="mx-2 flex h-[72px] items-center justify-between bg-[#c8f8d8] pr-4 text-[#071426] sm:mx-0 sm:pr-6">
              <label className="flex h-full items-center text-[15px] font-bold text-[#071426] sm:text-[18px]">
                <span className="flex w-[58px] justify-center">
                  <input className="h-5 w-5 rounded border-[#637789] accent-[#00a76f]" type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} aria-label="Select all filtered users" />
                </span>
                <span className="px-5 sm:px-6">{selectedIds.length} selected</span>
              </label>
              <button className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#071426] transition hover:bg-[#b5efc8]" type="button" aria-label="Delete selected users" onClick={deleteSelected}>
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="scrollbar-hide overflow-x-auto px-2 sm:px-0">
            <div className="min-w-[1396px]">
            <table className="w-full table-fixed border-collapse text-[#071426]">
              <colgroup>
                <col className="w-[58px]" />
                <col className="w-[310px]" />
                <col className="w-[220px]" />
                <col className="w-[300px]" />
                <col className="w-[240px]" />
                <col className="w-[150px]" />
                <col className="w-[118px]" />
              </colgroup>
              {selectedIds.length === 0 && (
              <thead>
                  <tr className="h-[72px] bg-[#f4f6f8] text-left text-[17px] text-[#607386]">
                    <th className="w-[58px] px-0 text-center">
                      <input className="h-5 w-5 rounded border-[#637789] accent-[#00a76f]" type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} aria-label="Select all filtered users" />
                    </th>
                    <SortableHeader label="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
                    <SortableHeader label="Phone number" sortKey="phone" sortConfig={sortConfig} onSort={handleSort} />
                    <SortableHeader label="Company" sortKey="company" sortConfig={sortConfig} onSort={handleSort} className="min-w-[220px]" />
                    <SortableHeader label="Role" sortKey="role" sortConfig={sortConfig} onSort={handleSort} />
                    <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} onSort={handleSort} />
                    <th className="w-[118px] px-6 text-center" aria-label="Actions" />
                  </tr>
                </thead>
              )}

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="7" className="h-[220px] text-center font-semibold text-[#637381]">Loading users from IndexedDB...</td>
                  </tr>
                )}

                {!loading && dbError && (
                  <tr>
                    <td colSpan="7" className="h-[220px] text-center font-semibold text-[#d71920]">{dbError}</td>
                  </tr>
                )}

                {!loading && !dbError && visibleUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="h-[220px] text-center font-semibold text-[#637381]">No users found.</td>
                  </tr>
                )}

                {!loading && !dbError && visibleUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={cx(
                      'border-b border-dashed border-[#dfe5eb] text-left text-[18px] transition last:border-b-0 hover:bg-[#fbfcfd]',
                      denseEnabled ? 'h-[68px]' : 'h-[96px]',
                      selectedIds.includes(user.id) && 'bg-[#f5fbfb]'
                    )}
                  >
                    <td className={cx('w-[58px] px-0 text-center', denseEnabled ? 'py-0' : 'py-4')}>
                      <input
                        className="h-5 w-5 rounded border-[#637789] accent-[#00a76f]"
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => toggleOne(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </td>
                    <td className={cx('px-6', denseEnabled ? 'py-0' : 'py-4')}>
                      <div className="flex min-w-[310px] items-center gap-[18px]">
                        <img className="h-12 w-12 rounded-full bg-[#edf2f6] object-cover ring-4 ring-white" src={user.avatarUrl || avatar(user.name)} alt={`${user.name} avatar`} />
                        <span className="min-w-0">
                          <strong className="mb-1 block truncate text-[18px] font-medium text-[#071426]">{user.name}</strong>
                          <small className="block truncate text-[17px] text-[#8a98a8]">{user.email}</small>
                        </span>
                      </div>
                    </td>
                    <td className={cx('whitespace-nowrap px-6', denseEnabled ? 'py-0' : 'py-4')}>{user.phone}</td>
                    <td className={cx('px-6', denseEnabled ? 'py-0' : 'py-4')}>
                      <span className="company-cell block min-w-[220px] whitespace-nowrap leading-[1.35]">
                        {user.company}
                      </span>
                    </td>
                    <td className={cx('whitespace-nowrap px-6', denseEnabled ? 'py-0' : 'py-4')}>{user.role}</td>
                    <td className={cx('px-6', denseEnabled ? 'py-0' : 'py-4')}>
                      <span className={cx('inline-flex min-w-[74px] justify-center rounded-lg px-[9px] py-[7px] text-[14px] font-extrabold capitalize leading-none', statusBadgeClasses[user.status])}>
                        {user.status}
                      </span>
                    </td>
                    <td className={cx('px-6', denseEnabled ? 'py-0' : 'py-4')}>
                      <div className="flex items-center justify-end gap-3 text-[#637381]">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#edf2f6] hover:text-[#172230]" type="button" aria-label={`Edit ${user.name}`} onClick={() => openEditForm(user)}>
                          <EditIcon className="h-6 w-6" />
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#edf2f6] hover:text-[#172230]" type="button" aria-label={`Delete ${user.name}`} onClick={() => setDeleteTarget(user)}>
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <footer className="flex min-h-[78px] flex-col gap-4 border-t border-[#edf1f4] px-2 py-4 text-[15px] text-[#071426] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-[18px]">
            <label className="flex items-center gap-3">
              <input className="peer sr-only" type="checkbox" checked={denseEnabled} onChange={(event) => setIsDense(event.target.checked)} />
              <span className="relative h-6 w-11 rounded-full bg-[#c7d0d9] transition before:absolute before:left-[3px] before:top-[3px] before:h-[18px] before:w-[18px] before:rounded-full before:bg-white before:transition before:content-[''] peer-checked:bg-[#00a76f] peer-checked:before:translate-x-[20px]" />
              Dense
            </label>

            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8">
              <label className="flex items-center gap-3 whitespace-nowrap">
                Rows per page:
                <select className="rounded-md border-0 bg-white px-2 py-1 outline-none" value={rowsPerPage} onChange={(event) => setRowsPerPage(Number(event.target.value))}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </label>

              <span className="justify-self-center whitespace-nowrap text-center">{filteredUsers.length ? pageStart + 1 : 0}-{Math.min(pageStart + rowsPerPage, filteredUsers.length)} of {filteredUsers.length}</span>

              <div className="flex items-center justify-self-end gap-2 text-[#8a98a8]">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ease-out hover:bg-[#f4f6f8] hover:text-[#172230] disabled:cursor-not-allowed disabled:text-[#c7d0d9]"
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ease-out hover:bg-[#f4f6f8] hover:text-[#172230] disabled:cursor-not-allowed disabled:text-[#c7d0d9]"
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </footer>
        </section>
        </div>
      </main>

      {isFormOpen && (
        <UserModal
          form={form}
          isEditing={Boolean(editingUser)}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          onChange={updateForm}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          user={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteOne}
        />
      )}
    </Fragment>
  );
}

function Chip({ label, value, onRemove }) {
  return (
    <div className="flex min-h-[50px] items-center gap-2 rounded-xl border border-dashed border-[#dfe5eb] px-3">
      <strong className="text-[18px] text-[#071426]">{label}:</strong>
      <button className="inline-flex h-[30px] items-center gap-2 rounded-lg bg-[#eef2f6] px-3 text-[16px] font-semibold capitalize text-[#071426]" type="button" onClick={onRemove}>
        {value}
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8a98a8] text-[12px] leading-none text-white">x</span>
      </button>
    </div>
  );
}

function SortableHeader({ label, sortKey, sortConfig, onSort, className = '' }) {
  const isActive = sortConfig.key === sortKey;

  return (
    <th className={cx('px-6', className)}>
      <button className={cx('inline-flex items-center gap-1 font-bold', isActive ? 'text-[#071426]' : 'text-[#607386]')} type="button" onClick={() => onSort(sortKey)}>
        {label}
        {isActive && (
          <ArrowUpIcon className={cx('h-5 w-5 text-[#637381] transition', sortConfig.direction === 'desc' && 'rotate-180')} />
        )}
      </button>
    </th>
  );
}

function UserModal({ form, isEditing, onClose, onSubmit, onChange }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071426]/40 p-4 backdrop-blur-sm" role="presentation">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-[#edf1f4] bg-white p-4 shadow-[0_24px_80px_rgba(15,28,43,0.22)] sm:p-6" role="dialog" aria-modal="true" aria-labelledby="user-form-title">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="user-form-title" className="text-left text-[22px] font-bold tracking-[-0.02em] text-[#071426] sm:text-[28px]">{isEditing ? 'Edit user' : 'Add user'}</h2>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#637381] hover:bg-[#f6f8fa]" type="button" onClick={onClose} aria-label="Close form">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <FieldGroup className="sm:col-span-2" label="Avatar link">
            <input
              className="h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-[16px] text-[#071426] outline-none transition placeholder:text-[#8a98a8] focus:border-[#172230]"
              type="url"
              placeholder="https://example.com/avatar.png"
              value={form.avatarUrl}
              onChange={(event) => onChange('avatarUrl', event.target.value)}
            />
          </FieldGroup>

          <FieldGroup label="Name">
            <input className="h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-[16px] text-[#071426] outline-none transition focus:border-[#172230]" value={form.name} onChange={(event) => onChange('name', event.target.value)} required />
          </FieldGroup>
          <FieldGroup label="Email">
            <input className="h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-[16px] text-[#071426] outline-none transition focus:border-[#172230]" type="email" value={form.email} onChange={(event) => onChange('email', event.target.value)} required />
          </FieldGroup>
          <FieldGroup label="Phone">
            <input className="h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-[16px] text-[#071426] outline-none transition focus:border-[#172230]" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} required />
          </FieldGroup>
          <FieldGroup label="Company">
            <input className="h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-[16px] text-[#071426] outline-none transition focus:border-[#172230]" value={form.company} onChange={(event) => onChange('company', event.target.value)} required />
          </FieldGroup>

          <FieldGroup label="Role">
            <select className="h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-[16px] text-[#071426] outline-none transition focus:border-[#172230]" value={form.role} onChange={(event) => onChange('role', event.target.value)}>
              {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </FieldGroup>

          <FieldGroup label="Status">
            <select className="h-12 w-full rounded-xl border border-[#dfe5eb] bg-white px-4 text-[16px] text-[#071426] outline-none transition focus:border-[#172230]" value={form.status} onChange={(event) => onChange('status', event.target.value)}>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </FieldGroup>

          <div className="mt-2 flex flex-col justify-end gap-3 sm:col-span-2 sm:flex-row">
            <button type="button" className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#dfe5eb] bg-white px-4 font-bold text-[#52677a] hover:bg-[#f6f8fa] sm:min-w-[104px] sm:w-auto" onClick={onClose}>Cancel</button>
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#172230] px-4 font-bold text-white hover:bg-[#223244] sm:min-w-[132px] sm:w-auto">{isEditing ? 'Save changes' : 'Create user'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldGroup({ label, className = '', children }) {
  return (
    <label className={cx('grid gap-2 text-left text-[14px] font-bold text-[#52677a]', className)}>
      <span className="pl-1">{label}</span>
      {children}
    </label>
  );
}

function ConfirmDialog({ user, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071426]/40 p-4 backdrop-blur-sm" role="presentation">
      <div className="w-full max-w-[560px] rounded-[24px] border border-[#edf1f4] bg-white px-8 py-7 text-left shadow-[0_24px_80px_rgba(15,28,43,0.22)]" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <h2 id="delete-title" className="text-[24px] font-bold tracking-[-0.01em] text-[#1f2937]">Delete</h2>
        <p className="mt-6 text-[18px] leading-[1.6] text-[#374151]">Are you sure want to delete?</p>
        <div className="mt-10 flex justify-end gap-4">
          <button type="button" className="inline-flex h-12 min-w-[86px] items-center justify-center rounded-xl border border-[#d9dee7] bg-white px-5 text-[18px] font-bold text-[#374151] hover:bg-[#f6f8fa]" onClick={onCancel}>Cancel</button>
          <button type="button" className="inline-flex h-12 min-w-[86px] items-center justify-center rounded-xl bg-[#ff5630] px-5 text-[18px] font-bold text-white hover:bg-[#ef4b27]" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.75 4.5a6.25 6.25 0 0 1 4.95 10.06l3.37 3.37a.75.75 0 1 1-1.06 1.06l-3.37-3.37A6.25 6.25 0 1 1 10.75 4.5Zm0 1.5a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Z" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V5h4.25a.75.75 0 0 1 0 1.5h-.8l-1.02 13.02A2.75 2.75 0 0 1 14.69 22H9.31a2.75 2.75 0 0 1-2.74-2.48L5.55 6.5h-.8a.75.75 0 0 1 0-1.5H9V3.75ZM10.5 5h3V3.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25V5Z" />
    </svg>
  );
}

function EditIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m15.23 5.23 3.54 3.54-9.19 9.19-3.9.36.36-3.9 9.19-9.19Zm1.41-1.41.7-.7a2.5 2.5 0 0 1 3.54 3.54l-.7.7-3.54-3.54Z" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ArrowUpIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 10 3 3 7-7" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default App;
