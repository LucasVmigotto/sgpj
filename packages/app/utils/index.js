export const userInRoles = (user, roles) =>
  user.roles.filter(el => roles
    .includes(el)).length > 0
