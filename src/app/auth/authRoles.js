/**
 * Authorization Roles
 */
const authRoles = {
    superadmin: ['superadmin'],
    admin    : ['admin','superadmin'],
    staff    : ['admin', 'staff','superadmin'],
    user     : ['superadmin','admin', 'staff', 'user'],
    onlyGuest: []
};

export default authRoles;
