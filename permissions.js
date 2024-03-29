var Q = require("q");

var User = require("./models/user");
var Group = require("./models/group");
var Activity = require("./models/activity");

/**
 * Checks whether user has required permissions for a given scope
 * @param user
 * @param scope
 * @returns boolean
 */
function check(user, scope) {
  var loggedIn = true;
  return Q.Promise(function (resolve, reject) {
    if (!user) {
      // User undefined
      loggedIn = false;
      resolve();
    } else if (typeof user === 'number') {
      resolve(User.findByPk(user));
    } else {
      console.log("easy going");
      resolve(user);
    }
  }).then(function (user) {
    if (loggedIn && user.dataValues.isAdmin) {
      // Admin has all permissions
      return true;
    }
    switch (scope.type) {
      case "PAGE_VIEW":
        // Everyone allowed to view pages
        return true;
      case "PAGE_MANAGE":
        // Only admins allowed to manage pages
        return false;
      case "ACTIVITY_VIEW":
        return Activity.findByPk(scope.value).then(function (activity) {
          if (!activity) {return false;}
          if (activity.approved) {
            // Approved activities allowed to be viewed by anyone
            return true;
          }
          // Unapproved activities only allowed to be viewed by organizers and admins
          return loggedIn ? user.hasGroup(activity.OrganizerId) : false;
        });
      case "ACTIVITY_EDIT":
        return Activity.findByPk(scope.value).then(function (activity) {
          // Activities only allowed to be edited by organizers and admins
          return loggedIn ? user.hasGroup(activity.OrganizerId) : false;
        });
      case "GROUP_ORGANIZE":
        if (!loggedIn) return false;
        return Group.findByPk(scope.value).then(function (group) {
          // Check whether group is allowed to organize
          if (!group.canOrganize) return false;
          // If the group is allowed to organize, return whether user is member of the group
          return user.hasGroup(group.id);
        });
      case "USER_MANAGE":
        // Only admins allowed to manage users
        return false;
      default:
        throw new Error("Unknown scope type");
    }
  });
}

function all(promises) {
  return Q.all(promises).then(function (results) {
    return results.every(function (e) {return e;});
  });
}


function requireAll(scopes) {
  if (!scopes.length) {scopes = [scopes];}
  return function (req, res, next) {
    var user = res.locals.session ? res.locals.session.user : null;
    var promises = scopes.map(function (scope) {
      return check(user, scope);
    });
    all(promises).then(function (result) {
      if (!result) {
        return res.sendStatus(403);
      }
      return next();
    }).fail(function (err) {
      next(err);
    }).done();
  };
}

module.exports = {
  all: all,
  check: check,
  requireAll: requireAll
};
