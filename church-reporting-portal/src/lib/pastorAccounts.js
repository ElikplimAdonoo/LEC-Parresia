// Multi-account registry for Love Economy Church
// Central Zone branch catalog, credentials, and pastoral profile management

export const CENTRAL_ZONE_BRANCHES = [
  "Parresia",
  "Adenta Main",
  "Accra Central",
  "Madina Assembly",
  "Legon Campus",
  "East Legon",
  "Haatso Gathering",
  "Ashaley Botwe",
  "Dodowa Mission",
  "Oyarifa Hub",
];

export const INITIAL_PASTORS = [
  {
    id: "pastor-makafui",
    full_name: "Rev. Makafui Tetteh Kumahlor",
    phone: "+233 24 123 4567",
    email: "makafui@loveeconomychurch.org",
    branch_name: "Parresia",
    zone_name: "Central Zone",
    gathering_center: "LC Live Center",
    assigned_roles: ["BRANCH_PASTOR", "ZONAL_HEAD", "EXECUTIVE"],
    default_role: "BRANCH_PASTOR",
    password: "1234", // Simple default password
    avatar: "",
  },
  {
    id: "pastor-michael",
    full_name: "Ps. Michael Osei",
    phone: "+233 20 456 7890",
    email: "mosei@loveeconomychurch.org",
    branch_name: "Adenta Main",
    zone_name: "Central Zone",
    gathering_center: "Adenta Sanctuary",
    assigned_roles: ["BRANCH_PASTOR"],
    default_role: "BRANCH_PASTOR",
    password: "1234",
    avatar: "",
  },
  {
    id: "pastor-emmanuel",
    full_name: "Rev. Emmanuel Quaye",
    phone: "+233 20 987 6543",
    email: "equaye@loveeconomychurch.org",
    branch_name: "Accra Central",
    zone_name: "Central Zone",
    gathering_center: "Central Arena",
    assigned_roles: ["BRANCH_PASTOR", "ZONAL_HEAD"],
    default_role: "ZONAL_HEAD",
    password: "1234",
    avatar: "",
  },
  {
    id: "bishop-daddy",
    full_name: "Bishop / Executive Council ('Daddy')",
    phone: "+233 50 111 2222",
    email: "daddy@loveeconomychurch.org",
    branch_name: "Headquarters",
    zone_name: "Worldwide",
    gathering_center: "Apostolic Council",
    assigned_roles: ["EXECUTIVE"],
    default_role: "EXECUTIVE",
    password: "1234",
    avatar: "",
  },
];

const LOCAL_USERS_KEY = "lec_pastoral_accounts_v2";

export const getPastoralAccounts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PASTORS;
  } catch {
    return INITIAL_PASTORS;
  }
};

export const updatePastoralAccount = (updatedUser) => {
  try {
    const accounts = getPastoralAccounts();
    const index = accounts.findIndex((a) => a.id === updatedUser.id);
    let newAccounts;
    if (index >= 0) {
      newAccounts = [...accounts];
      newAccounts[index] = { ...newAccounts[index], ...updatedUser };
    } else {
      newAccounts = [updatedUser, ...accounts];
    }
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(newAccounts));
    return updatedUser;
  } catch (err) {
    console.error("Failed to update pastoral account:", err);
    return updatedUser;
  }
};
