define({ "api": [
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tra",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/choice.route.js",
    "groupTitle": "Tra"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/choice.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/question.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/role.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/site.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/support.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Delete Tracker",
    "description": "<p>Delete a tracker</p>",
    "version": "1.0.0",
    "name": "DeleteTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/tracker.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/choice.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/question.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/role.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/shift.type.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/site.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/support.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/:id",
    "title": "Get Tracker",
    "description": "<p>Get tracker information</p>",
    "version": "1.0.0",
    "name": "GetTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/tracker.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/choice.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/question.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/role.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/shift.type.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/site.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/support.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "put",
    "url": "v1/trackers/:id",
    "title": "Replace Tracker",
    "description": "<p>Replace the whole tracker document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "Tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/tracker.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/question.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/role.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/site.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/support.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers/profile",
    "title": "Tracker Profile",
    "description": "<p>Get logged in tracker profile information</p>",
    "version": "1.0.0",
    "name": "TrackerProfile",
    "group": "Tracker",
    "permission": [
      {
        "name": "tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Trackers can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/tracker.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/choice.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/question.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/role.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/site.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/support.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.status.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "patch",
    "url": "v1/trackers/:id",
    "title": "Update Tracker",
    "description": "<p>Update some fields of a tracker document</p>",
    "version": "1.0.0",
    "name": "UpdateTracker",
    "group": "Tracker",
    "permission": [
      {
        "name": "Tracker"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>Tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Tracker's role (You must be an admin to change the tracker's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Tracker's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Tracker's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Tracker's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Tracker's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only tracker with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Tracker does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/tracker.route.js",
    "groupTitle": "Tracker"
  },
  {
    "type": "post",
    "url": "v1/users",
    "title": "Create User",
    "description": "<p>Create a new user</p>",
    "version": "1.0.0",
    "name": "CreateUser",
    "group": "User",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "user",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>User's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/user.route.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "v1/users/:id",
    "title": "Delete User",
    "description": "<p>Delete a user</p>",
    "version": "1.0.0",
    "name": "DeleteUser",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "No Content 204": [
          {
            "group": "No Content 204",
            "optional": false,
            "field": "Successfully",
            "description": "<p>deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can delete the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only user with same id or admins can delete the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>User does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/user.route.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "v1/users/:id",
    "title": "Get User",
    "description": "<p>Get user information</p>",
    "version": "1.0.0",
    "name": "GetUser",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only user with same id or admins can access the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>User does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/user.route.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "v1/users",
    "title": "List Users",
    "description": "<p>Get a list of users</p>",
    "version": "1.0.0",
    "name": "ListUsers",
    "group": "User",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Users per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "user",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>User's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>List of users.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/user.route.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "v1/users/:id",
    "title": "Replace User",
    "description": "<p>Replace the whole user document with a new one</p>",
    "version": "1.0.0",
    "name": "ReplaceUser",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "user",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>User's role (You must be an admin to change the user's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only user with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>User does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/user.route.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "v1/users/:id",
    "title": "Update User",
    "description": "<p>Update some fields of a user document</p>",
    "version": "1.0.0",
    "name": "UpdateUser",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "user",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>User's role (You must be an admin to change the user's role)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can modify the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only user with same id or admins can modify the data</p>"
          }
        ],
        "Not Found 404": [
          {
            "group": "Not Found 404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>User does not exist</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/user.route.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "v1/users/profile",
    "title": "User Profile",
    "description": "<p>Get logged in user profile information</p>",
    "version": "1.0.0",
    "name": "UserProfile",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Users can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/user.route.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/choice.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/question.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/role.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/shift.type.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/site.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/support.status.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.status.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "post",
    "url": "v1/trackers",
    "title": "Create tracker",
    "description": "<p>Create a new tracker</p>",
    "version": "1.0.0",
    "name": "Createtracker",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..128",
            "optional": false,
            "field": "password",
            "description": "<p>tracker's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..128",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>tracker's id</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Created 201",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>tracker's role</p>"
          },
          {
            "group": "Created 201",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ],
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can create the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can create the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/tracker.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/choice.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/question.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/role.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/shift.type.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/site.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/support.status.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/timesheet.status.route.js",
    "groupTitle": "tracker"
  },
  {
    "type": "get",
    "url": "v1/trackers",
    "title": "List Trackers",
    "description": "<p>Get a list of trackers</p>",
    "version": "1.0.0",
    "name": "ListTrackers",
    "group": "tracker",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>tracker's access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>List page</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": true,
            "field": "perPage",
            "defaultValue": "1",
            "description": "<p>Trackers per page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>tracker's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>tracker's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "tracker",
              "admin"
            ],
            "optional": true,
            "field": "role",
            "description": "<p>tracker's role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "trackers",
            "description": "<p>List of trackers.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated trackers can access the data</p>"
          }
        ],
        "Forbidden 403": [
          {
            "group": "Forbidden 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/routes/v1/tracker.route.js",
    "groupTitle": "tracker"
  }
] });
