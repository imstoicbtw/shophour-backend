export const ROLES: Record<string, string> = {
    Admin: "admin",
    Customer: "customer",
    Manager: "manager",
}

export const PASSWORD_REGEX: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;